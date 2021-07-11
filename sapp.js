const path = require("path");
const fs = require("fs");
const http = require("http");
const crypto = require("crypto");


const express = require("express");
const axios = require("axios");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const cors = require("cors");


const _ = require("./utils/getEnv")();
const User = require("./models/user");
const Investment = require("./models/investment");
const Withdrawal = require("./models/withdrawal");
const Deposit = require("./models/deposit");
const Referral = require("./models/referral");
const Order = require("./models/order");
const AdminMeta = require("./models/adminmeta");
const suid = require("./utils/uuid");
const {inputData} = require("./data/signup");
const {inputData: loginData} = require("./data/login");
const {inputData: profileData} = require("./data/profile");
const fmtDate = require("./utils/formatDate");
const isAuth = require("./middleware/auth");



const port = process.env.PORT;
const url = "mongodb+srv://austinakamelu:austin_1996@cluster0.3dohv.mongodb.net/bitufy"
const sapp = express();
const store = new MongoStore({
    uri: process.env.MONGO_URL || url,
    collection: "sessions"
})

sapp.set("view engine", "ejs");
sapp.use(session({
    secret: 'Bitufy is very dope',
    resave: true,
    saveUninitialized: false,
    store
}))
sapp.use(express.urlencoded({ extended: false }))
sapp.use(express.json());
sapp.use(csrf());
sapp.use(cors())
sapp.use(express.static(path.join(__dirname, "public")))
sapp.use((req, res, next) => {
    res.locals.token = req.session.csrfSecret;
    res.locals.session = req.session;
    res.locals.isComplete = req.session.isComplete;
    next()
})

const server = http.createServer(sapp);



sapp.use(async(req, res, next) => {

    try{
        const totalUsers = await User.find().countDocuments();
        const verifiedUsers = await User.find({verified: true}).countDocuments();
        const btcAddress = "3JoRTSfJMXFbifoVEzDpAQhZ3xLvi72F4w";
        const ethAddress = "0xCFeD01b0A5C74b7Fa27D1d54e4378060c42CAF5B";
        let totalVolume = await Investment.find({confirmed: true})
        totalVolume = totalVolume.reduce((prev, accu) => {
            prev.amount + accu
        }, 0)

        const adminMeta = await AdminMeta.find().countDocuments();

        if(adminMeta === 0){
            const meta = await new AdminMeta({
                btcAddress,
                ethAddress,
                totalUsers,
                verifiedUsers,
                totalVolume
            })
            await meta.save()
            next();
        } else {
            const found = await AdminMeta.findOne({btcAddress})
            found.totalUsers = totalUsers;
            found.verifiedUsers = verifiedUsers;
            found.totalVolume = totalVolume;
            await found.save();
            next()
        }

    }catch(err){
        console.log(err.message + ", Every Route")
    }
})



sapp.get("/", (req, res, next) => {
    res.status(200).render("index", {
        path: "/"
    })
})


sapp.get("/api/resend-mail", async (req, res, next) => {
    
    try{
        //first we get the user
        const username = req.session?.user?.username || req.session.username;
        const user = await User.findOne({username});
        if(user){
            //then we update user data 
            user.token = null;
            user.v_token = crypto.randomBytes(64).toString("hex");
            user.v_tokenExpiration = Date.now() + (1000 * 60 * 30);
            await user.save();
            const resp = await axios.get("http://127.0.0.1:9001/api/verify/sendmail", {
                headers: {
                "x-name": user.username,
                "x-email": user.email,
                "x-fullname": user.first_name + " " + user.other_names,
                "x-token": user.v_token
                }
            })
            console.log(resp.data)
            return res.json({
                status: "success",
                statusCode: 201,
                message: "Email has been sent successfully"
            })
        } else {
            res.json({
                status: "error",
                statusCode: 404,
                message: "User doesn't exist"
            })
        }

    }catch(err){
        res.json({
            status: "error",
            statusCode: 500,
            message: err.message
        })
    }
})


sapp.get("/api/change-pwd", isAuth, async (req, res, next) => {
    const {old_pass, new_pass} = req.query;

    try {
        //first we check if the password matches the old one
        const found = await User.findOne({
            username: req.session.user.username
        })
        const response = await axios.get("https://www.aladsempire.com/api/9000/compare", {
            headers: {
                "x-password": old_pass,
                'x-hashedpassword': found.password
            }
        })
        const {match, status} = response.data;

        if(status === "success" && match) {
            const response = await axios.get("https://www.aladsempire.com/api/9000/hash", {
                headers: {
                    "x-password": new_pass,
                }
            })
            const {hashedPassword, status} = response.data;
            //then we should change the password
            if(status === "success"){
                found.password = hashedPassword;
                await found.save();
                return res.json({
                    status: "success",
                    statusCode: 201,
                    message: "Password updated successfully"
                })

            }else {
                console.log(response.data)
            }

        }else {
            //At this point the password the user provided is wrong
            return res.json({
                status: "error",
                statusCode: 401,
                message: "The current password you entered doesn't match"
            })
        }


    }catch(err){
        res.json({
            status: "error",
            statusCode: 500,
            message: err.message
        })
    }
})


sapp.get("/api/update-profile", isAuth, async (req, res, next) => {
    try{
        const user = await User.findOne({username: req.session.user.username});
        if(!user.profile_complete){
            //first we retrieve our data
            if(req.query.pin){
                const {pin} = req.query;
                user.pin = pin;
                await user.save();
                return res.json({
                    status: "success",
                    statusCode: 201,
                    message: "PIN created successfully"
                })
            }else {
                const {phone, dob} = req.query;
                user.phone = phone;
                user.dob = dob;
                user.profile_complete = true;
                await user.save();
                return res.json({
                    status: "success",
                    statusCode: 201,
                    message: "Profile completed successfully"
                })
            }

        }else {}
        // await User.updateOne({
        //     username: req.session.user.username
        // }, {
        //     full_name,
        //     email, 
        //     phone,
        //     country,
        //     dob
        // })
       res.json({
           status: "success",
           statusCode: 201,
           message: "Profile updated successfully"
       })

    }catch(err){
        return res.json({
            status: "error",
            statusCode: 500,
            message: err.message
        })
    }
})


sapp.get("/api/deposit", async (req, res, next) => {
    const {userId, amount, token} = req.query;

    console.log({userId, amount, token})
    try{
        const user = await User.findOne({refId: userId});
        const found = await Deposit.findOne({userId});
        found.confirmed = true;
        found.amount = amount;
        found.token = token;
        await found.save();

        const order = await new Order({
            userId,
            status: "pending",
            code: found.deposit_code,
            type: "Deposit",
            token,
            amount,
            from: token === "btc" ?  user.bitcoin  :   user.ethereum,
            to: "1F1tAaz5x1HUXrCNLbtMDqcw6o5GNn4xqX"
        })
        await order.save();


        //here we set deposited to true for said investment....

        return res.json({
            status: "success",
            statusCode: 201,
            message: "Order submitted successfully"
        })
    }catch(err){
        return res.json({
            status: "error",
            statusCode: 500,
            message: err.message
        })
    }
})


sapp.get("/api/withdraw", async (req, res, next) => {
    const {userId, amount, token} = req.query;

    try{
        const user = await User.findOne({refId: userId});
        const found = await Withdrawal.findOne({userId});
        found.confirmed = true;
        found.amount = amount;
        found.token = token;
        await found.save();

        const order = await new Order({
            userId,
            status: "pending",
            code: found.withdrawal_code,
            type: "Withdraw",
            token,
            amount,
            from: "1F1tAaz5x1HUXrCNLbtMDqcw6o5GNn4xqX",
            to: token === "btc" ?  user.bitcoin  :   user.ethereum,
        })
        await order.save();

        return res.json({
            status: "success",
            statusCode: 201,
            message: "Withdrawal request submitted successfully"
        })
    }catch(err){
        return res.json({
            status: "error",
            statusCode: 500,
            message: err.message
        })
    }
})


sapp.get("/admin/referral", isAuth, async (req, res, next) => {
    try{
        
        const user = await User.findOne({
            username: req.session.user.username
        })
        const tableData = await Referral.findOne({userId: user.refId})

        const tableHeaders = ["#", "username", "createdAt", "amount", "deposited", "confirmed"];
        console.log(tableHeaders, tableData);

        
        const referral_link = `http://${req.hostname}:7070/auth/signup?ref=${user.refId}`
        res.status(200).render("referral", {
            path: "/admin/referral",
            name: "Referral",
            ref_link: referral_link,
            tableHeaders,
            tableData,
            fmtDate,
            code: user.country_code.toLocaleLowerCase(),
        })
    }catch(err){
        console.log("Error from Referral")
    }
})


sapp.get("/admin/settings", isAuth, async (req, res, next) => {

    try{
        const user = await User.findOne({username: req.session.user.username});
        res.status(200).render("settings", {
            path: "/admin/settings",
            name: "Settings",
            code: user.country_code.toLocaleLowerCase(),
        })
    }catch(err){
        console.log(err.message)
    }
})



sapp.get("/admin/profile", isAuth, async (req, res, next) => {
    try{
        
        const user = await User.findOne({
            username: req.session.user.username
        })

        console.log(user)
        res.status(200).render("profile", {
            path: "/admin/profile",
            name: "Profile",
            profileData,
            user,
            code: user.country_code.toLocaleLowerCase(),
        })
    }catch(err){
        console.log("Error from Profile")
    }
})

sapp.get("/team", async(req, res, next) => {
    res.status(200).render("team", {
        path: "/team"
    })
})

sapp.get("/about", async(req, res, next) => {
    res.status(200).render("about", {
        path: "/about"
    })
})

sapp.get("/pricing", async(req, res, next) => {
    res.status(200).render("pricing", {
        path: "/pricing"
    })
})

sapp.get("/wallet", (req, res, next) => {
    res.render("wallet", {
        path: "/wallet"
    })
})

sapp.get("/faq", async(req, res, next) => {
    res.status(200).render("faq", {
        path: "/faq"
    })
})

sapp.get("/contact", async(req, res, next) => {
    res.status(200).render("contact", {
        path: "/contact"
    })
})


sapp.get("/admin/dashboard", isAuth, async (req, res, next) => {

    try{
        const user = await User.findOne({username: req.session.user.username});
        const users = await User.find();
        const investment = await Investment.findOne({userId: user.refId});
        let [adminmeta] = await AdminMeta.find();
        const userTableHeaders = ["#", "Full Name", "Email", "Username", "Role", "Upline", "Verified", "Referrals", "RefId", "CreatedAt", "Country", "Phone"];
        let now = new Date() + "";
        const month = now.split(" ")[1];
        const day = now.split(" ")[2];
        

        const data = [
            {
                title: "amount",
                icon: "fas fa-funnel-dollar",
                value: "0"
            },
            {
                title: "bonus",
                icon: "fas fa-boxes",
                value: "0"
            },
            {
                title: "referral bonus",
                icon: "fas fa-chart-line",
                value: "0"
            },
            {
                title: "cashout date",
                icon: "fas fa-calendar-week",
                value: "--"
            },
        ]

        res.status(200).render("dash", {
            path: "/admin/dashboard",
            meta: investment,
            name: "Overview",
            month,
            // isComplete: user.profile_complete,
            userHeaders: userTableHeaders,
            fmtDate,
            adminmeta: adminmeta._doc,
            day,
            token: req.csrfToken(),
            code: user.country_code.toLocaleLowerCase(),
            users,
            card_data: data
        })
    }catch(err){
        console.log(err.message + ", Dashboard")
    }
})


sapp.get("/admin/deposit", isAuth, async (req, res, next) => {
    const data = [
        {
            name: "btc",
            address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"
        },
        {
            name: "eth",
            address: "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B"
        },
    ]

    try{
        const user = await User.findOne({username: req.session.user.username});

        let newOrder;
        const unfinished = await Deposit.findOne({userId: user.refId, confirmed: false})
        if(unfinished){
            newOrder = unfinished;
        }else {
            newOrder = await new Deposit({
                userId: user.refId,
                deposit_code: suid("_", 5),
                token: "btc",
                confirmed: false,
                completed: false,
                amount: 0
            })

            await newOrder.save()
        }


        res.status(200).render("deposit", {
            path: "/admin/deposit",
            meta: newOrder,
            name: "Deposit",
            code: user.country_code.toLocaleLowerCase(),
            addresses: data
        })
    }catch(err){
        console.log(err.message + ", Deposit")
    }
})


sapp.get("/admin/withdraw", isAuth, async (req, res, next) => {

    try{
        const user = await User.findOne({username: req.session.user.username});
        const duplicate = await Withdrawal.findOne({userId: user.refId, confirmed: false})
        let newOrder;
        if(duplicate){
            newOrder = duplicate;
        }else {
            newOrder = await new Withdrawal({
                userId: user.refId,
                withdrawal_code: suid("_", 5),
                token: "btc",
                confirmed: false,
                completed: false,
                amount: 0,
            })

            await newOrder.save();
        }

        res.status(200).render("withdraw", {
            path: "/admin/withdraw",
            wallets: [user.bitcoin, user.ethereum],
            meta: newOrder,
            code: user.country_code.toLocaleLowerCase(),
            name: "Withdraw",
        })
    }catch(err){
        console.log(err.message + ", Withdraw")
    }
})


sapp.get("/admin/history", isAuth, async(req, res, next) => {
    try{
        const user = await User.findOne({username: req.session.user.username});
        const withdrawals = await Order.find({userId: user.refId, type: "Withdraw"})
        const deposits = await Order.find({userId: user.refId, type: "Deposit"})

        const withdrawal_headers = [
            "#", "Amount", "Withdrawal Code", "Date Requested", "Status", "Token"
        ]

        const deposit_headers = [
            "#", "Amount", "Funding Code", "Date Submitted", "Status", "Token"
        ]
    

        res.status(200).render("history", { 
            path: "/admin/history",
            name: "History",
            userId: user.refId,
            withdrawal_headers,
            deposit_headers,
            withdrawals,
            deposits,
            code: user.country_code.toLocaleLowerCase(),
            fmtDate
        })
    }catch(err){
        console.log(err.message + ", History")
    }
})


sapp.get("/verify", async (req, res, next) => {
    const {username, token} = req.query;
    console.log(username, token)

    try{
        const user = await User.findOne({username})
        if(!user){
            console.log("Invalid username")
        }
        if(user){
            if(token === user.v_token){
                if(Date.now() > user.v_tokenExpiration){
                    console.log("Link has expired!!!")
                }else {
                    user.verified = true;
                    user.v_token = null;
                    user.v_tokenExpiration = null;
                    user.token = crypto.randomBytes(64).toString("hex");
                    await user.save()
                    req.session.user = {
                        token: user.stoken,
                        username: user.username,
                        role: user.authorization,
                    }
                    req.session.isAuth = true;
                    req.session.save()
                    res.redirect("/admin/dashboard")
                }
            }else {
                console.log("Invalid token")
            }
        }
    }catch(err){
        console.log(err.message)
    }
})


sapp.get("/auth/login", (req, res, next) => {
    res.status(200).render("login", {
        path: "/auth/login",
        loginData,
        token: req.csrfToken()
    })
})


sapp.post("/auth/login", async(req, res, next) => {
    const {email, password} = req.body;

    try{
        //first check if a user exists 
        const user = await User.findOne({email})
        if(user){
            const response = await axios.get("https://www.aladsempire.com/api/9000/compare", {
                headers: {
                    "x-password": password,
                    'x-hashedpassword': user.password
                }
            })
            console.log(response.data)
            const {match, status} = response.data;
            
            if(status === "success"){
                if(match){
                    user.token = crypto.randomBytes(64).toString("hex");
                    await user.save()
                    req.session.user = {
                        token: user.token,
                        username: user.username,
                        role: user.authorization,
                    };
                    req.session.isAuth = true;
                    req.session.isComplete = user.profile_complete;
                    req.session.save()
                    if(user.verified){
                        res.json({
                            status: "success",
                            statusCode: 200,
                            message: {
                                verified: true,
                            }
                        })
                    }else {
                        res.json({
                            status: "success",
                            statusCode: 200,
                            message: {
                                verified: false,
                            }
                        })
                    }
                }else{
                    res.json({
                        status: "error",
                        statusCode: 401,
                        message: "Incorrect password"
                    })
                }
                
            }

        }else {
            res.json({
                status: "error",
                statusCode: 401,
                message: "This user doesn't exist in our database"
            })
        }
    }catch(err){
        res.json({
            status: "error",
            statusCode: 500,
            message: err.message
        })
    }
})


sapp.post("/auth/signup", async(req, res, next) => {
    const {first_name, other_names, email, username, bitcoin, password, code} = req.body;
    const ref = req.query.ref  || null
    console.log(ref)
    //we get back data on all the countries
    const filePath = path.join(__dirname, "data", "countries.json");
    let data = fs.readFileSync(filePath, "utf8");
    data = JSON.parse(data);
    const country = data.find(d => d.code === code).name;
    
    try{ 
        const users = await User.find();
        const duplicate = users.findIndex(u => u.email === email);
        if(duplicate > -1){
            res.json({
                status: "error",
                statusCode: 402,
                message: `${email} is already registered!!!`
            })
        }else {
            //here no duplicate so we check the username
            const duplicate = users.findIndex(u => u.username === username);
            if(duplicate > -1){
                res.json({
                    status: "error",
                    statusCode: 402,
                    message: `${username} has been taken!!!`
                })
            }else {
                //at this point he/she is very valid
                const response = await axios.get("https://www.aladsempire.com/api/9000/hash", {
                    headers: {
                        "x-password": password
                    }
                }),
                {hashedPassword, status} = response.data;
                if(status === 'success'){
                    const token = crypto.randomBytes(64).toString("hex")
                    const user = await new User({
                        first_name, 
                        other_names, 
                        username, 
                        email,
                        profile_complete: false,
                        authorization: "user",
                        referredBy: ref,
                        bitcoin, 
                        country_code: code,
                        country,
                        v_token: token,
                        token: null,
                        v_tokenExpiration: Date.now() + (1000 * 60 * 30),
                        ethereum: "", 
                        password: hashedPassword, 
                        phone: "",
                        verified: false,
                        refId: suid("-", 9),
                        referrals: 0,
                    })
                    req.session.username = user.username;
                    await user.save()
                    if(ref){
                        const referrer = await User.findOne({refId: ref});
                        referrer.referrals += 1;
                        await referrer.save();
        
                        const otherRefs = await Referral.findOne({userId: ref})
                        const referral_meta = {
                            username: user.username,
                            amount: 0,
                            regDate: user.createdAt,
                            confirmed: false,
                            deposited: false
                        }
        
                        const referral = await new Referral({
                            userId: ref,
                            referrals: !otherRefs ? [referral_meta] :
                            [...otherRefs.referrals, referral_meta]
                        })
        
                        await referral.save()
                    }
                    const investmentMeta = await new Investment({
                        userId: user.refId,
                        deposited: false,
                        confirmed: false,
                        token: null,
                        plans: [],
                        amount: 0,
                        bonus: 0,
                        referral_bonus: 0,
                        investment_date: null,
                        cashout_date: null,
                        eligible: false,
                        total_withdrawals: 0
                    })
                    await investmentMeta.save();
                    const rep = await axios.get("http://127.0.0.1:9001/api/verify/sendmail", {
                        headers: {
                        "x-name": username,
                        "x-email": email,
                        "x-fullname": first_name + " " + other_names,
                        "x-token": user.v_token
                        }
                    })
                    console.log(rep.data)
                    return res.json({
                        status: "success",
                        statusCode: 201,
                        message: "An email has been sent to you for verification"
                    })
                }
            }
        }
    }catch(err){
        console.log(err.message)
    }
})


sapp.get("/auth/verify", (req, res, next) => {
    res.status(200).render("verify", {
        path: "/auth/verify",
    })
})


sapp.get("/auth/logout", async (req, res, next) => {

    try{
        const found = await User.findOne({
            username: req.session.user.username
        })
        found.token = null;
        req.session.destroy(err => {
            err && console.log(err);
            res.redirect("/auth/login");
        })
    }catch(err){
        console.log(err.message)
    }

})

sapp.get("/auth/signup", (req, res, next) => {
    console.log(req.query)
    const {ref} = req.query;

    //we get back data on all the countries
    const filePath = path.join(__dirname, "data", "countries.json");
    let data = fs.readFileSync(filePath, "utf8");
    data = JSON.parse(data);

    res.status(200).render("register", {
        path: "/auth/signup",
        ref,
        countries: data,
        inputs: inputData,
        token: req.csrfToken()
    })
})


mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useFindAndModify: true
}).then(res => {
    server.listen(port, () => console.log(`Node App is running on port ${port}`))
}).catch(console.log)
