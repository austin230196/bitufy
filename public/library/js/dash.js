const $ = selector => document.querySelector(selector);
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
})
var eth = document.getElementById("eth");
var btc = document.getElementById("btc");
var wallet = document.getElementById("wallet_address");
var withdrawalAmount = document.getElementById("withdrawal_amount");
var submitBtn = document.querySelector(".withdrawn");
var depositAmtFeed = document.getElementById("deposit_amount_feed");
var feedback = document.getElementById("withdrawal_feedback");
var userId = document.getElementById("userId");
var refButton = document.getElementById("ref_button");
var ref_feedback = document.getElementById("ref_feedback");
var depButton = document.getElementById("deposited_button");
var ethPrice = document.getElementById("amount_eth");
var btcPrice = document.getElementById("amount_btc");
var dollarPrice = document.getElementById("deposit_amount");
var ethPicker = document.getElementById("eth_btn");
var btcPicker = document.getElementById("btc_btn");
var profileBtn = document.getElementById("profile_btn");
var profile_feed = document.getElementById("profile_data_feedback");
var profileInputs = document.querySelectorAll(".profile_form .input");
var oldPass = document.getElementById("old_password");
var newPass = document.getElementById("new_password");
var retypePass = document.getElementById("re_new_password");
var settingsBtn = document.getElementById("settings_btn");
var nomicsKey = "50f767ae220dfc7acc055f2ea093e1d83d836cb0";




if(window.location.pathname === "/admin/settings"){
    oldPass.addEventListener("keyup", e => {
        document.getElementById("settings_feed").style.display = "none";
    })

    newPass.addEventListener("keyup", e => {
        const feed = document.getElementById("new_pass_feed")
        const text = document.querySelector("#new_pass_feed em small")
        const {value} = e.target;
        if(value.length > 5){
            feed.style.color = "rgb(0, 200, 0)";
            text.textContent = "Password Strength:  "  + Math.floor((((value.length / 2) /  10) * 100)) + "%";
            feed.style.display = "block";
        }else {
            feed.style.color = "rgb(200, 0, 0)";
            feed.style.display = "block";
        }
    })

    retypePass.addEventListener("keyup", e => {
        const feed = document.getElementById("re_pass_feed")
        const text = document.querySelector("#re_pass_feed em small")
        const {value} = e.target;
        if(value === newPass.value){
            if(value.length > 5){
                feed.style.color = "rgb(0, 200, 0)";
                text.textContent = "Passwords Match";
                feed.style.display = "block";
                settingsBtn.removeAttribute("disabled");
            } else {
                feed.style.color = "rgb(200, 0, 0)";
                text.textContent = "Passwords Invalid";
                feed.style.display = "block";
                settingsBtn.setAttribute("disabled", true);
            }
        }else {
            text.textContent = "The passwords don't match.";
            feed.style.color = "rgb(200, 0, 0)";
            feed.style.display = "block";
            settingsBtn.setAttribute("disabled", true);
        }
    })

    settingsBtn.addEventListener("click", async e => {
        const feed = document.getElementById("settings_feed");
        if(oldPass.value){
            //then we submit data
            e.target.setAttribute("disabled", true);
            const url = `http://localhost:7070/api/change-pwd?old_pass=${oldPass.value}&new_pass=${newPass.value}`;
            try{
                const res = await axios.get(url);
                console.log(res.data);
                const {status, message} = res.data;
                if(status === "success"){
                    feed.textContent = message;
                    feed.style.backgroundColor = "rgba(0, 200, 0, .8)";
                    feed.style.color = "#000";
                    feed.style.padding = "10px";
                    feed.style.textAlign = "center";
                    feed.style.margin = "10px auto";
                    feed.style.display = "block";
                    feed.style.width = "80%";

                    window.location.pathname = "/auth/logout";
                }else {
                    feed.textContent = message;
                    feed.style.backgroundColor = "rgba(255, 0, 0, .8)";
                    feed.style.color = "#fff";
                    feed.style.padding = "10px";
                    feed.style.textAlign = "center";
                    feed.style.margin = "10px auto";
                    feed.style.display = "block";
                    feed.style.width = "80%";

                    e.target.removeAttribute("disabled");
                }
            }catch(err){console.log(err.message + " Settings")}
        }else {
            feed.textContent = "Please input your current password";
            feed.style.backgroundColor = "rgba(255, 0, 0, .8)";
            feed.style.color = "#fff";
            feed.style.padding = "10px";
            feed.style.textAlign = "center";
            feed.style.margin = "10px auto";
            feed.style.display = "block";
            feed.style.width = "80%";
        }
    })
}



if(window.location.pathname === "/admin/profile"){
    profileBtn.addEventListener("click", async e => {
        let hybrid = Array.from(profileInputs).map((p, i) => {
            return {
                [p.name]: p.value
            }
        })

        hybrid = hybrid.map(h => {
            let data;
            for(let i in h){
                data = h[i]
            }
            return data;
        })
        const [full_name, email, phone, country, dob] = hybrid;
        let url = `http://localhost:7070/api/update-profile?full_name=${full_name}&email=${email}&phone=${phone}&country=${country}&dob=${dob}`;
        try {
            const res = await axios.get(url)
            const {status, message} = res.data;
            if(status === "success"){
                profile_feed.textContent = message;
                profile_feed.style.backgroundColor = "rgba(0, 255, 0, .8)";
                profile_feed.style.color = "#000";
                profile_feed.style.padding = "10px";
                profile_feed.style.textAlign = "center";
                profile_feed.style.margin = "10px auto";
                profile_feed.style.display = "block";
                profile_feed.style.width = "80%";

                setTimeout(() => {
                    window.location.pathname = "/admin/dashboard";
                }, 3000)
            }
        }catch(err){
            console.log("Error while updating the profile")
        }

    })
}






if(window.location.pathname === "/admin/deposit"){
    let btc_price;
    let eth_price;
    const updatePrice = (BTC, ETH) => {
        btcPrice.value = dollarPrice.value/parseInt(BTC.price).toFixed(3)
        ethPrice.value = dollarPrice.value/parseInt(ETH.price).toFixed(3)
    }
    (async () => {
        const res = await axios
        .get(`https://api.nomics.com/v1/currencies/ticker?key=${nomicsKey}&ids=BTC,ETH&interval=1h,1d&convert=USD&per-page=100&page=1&format=json`)
        const [BTC, ETH] = res.data
        eth_price = ETH;
        btc_price = BTC;
        updatePrice(btc_price, eth_price)

    })()


    dollarPrice.addEventListener("keyup", e => {
        updatePrice(btc_price, eth_price)
    })

    btcPicker.addEventListener("click", e => {
        const target = e.currentTarget;
        let selected = target.getAttribute("selected");
        if(selected){
            target.classList.remove("btn-success");
            target.textContent = "Select";
            target.classList.add("btn-info");
            target.removeAttribute("selected");
            depButton.setAttribute("disabled", true);
        }else {
            if(ethPicker.getAttribute("selected")){
                ethPicker.classList.remove("btn-success");
                ethPicker.textContent = "Select";
                ethPicker.classList.add("btn-info");
                ethPicker.removeAttribute("selected");
            }
            target.classList.remove("btn-info");
            target.textContent = "Selected";
            target.classList.add("btn-success");
            target.setAttribute("selected", true);
            depButton.removeAttribute("disabled")
        }

    })

    ethPicker.addEventListener("click", e => {
        const target = e.currentTarget;
        let selected = target.getAttribute("selected");
        if(selected){
            target.classList.remove("btn-success");
            target.textContent = "Select";
            target.classList.add("btn-info");
            target.removeAttribute("selected");
            depButton.setAttribute("disabled", true);
        }else {
            if(btcPicker.getAttribute("selected")){
                btcPicker.classList.remove("btn-success");
                btcPicker.textContent = "Select";
                btcPicker.classList.add("btn-info");
                btcPicker.removeAttribute("selected");
            }
            target.classList.remove("btn-info");
            target.textContent = "Selected";
            target.classList.add("btn-success");
            target.setAttribute("selected", true);
            depButton.removeAttribute("disabled")
        }
    })

    depButton.addEventListener("click", async e => {
        const amount = dollarPrice.value;
        const token = document.querySelector("[selected=true]").id.includes("btc") ? 
        "btc" :  "eth";
        const id = document.getElementById("user_id").value;

        //first we make sure the deposit amount is more than 50
        if(amount > 50){
            //go ahead and create order
            const res = await axios.get("http://localhost:7070/api/deposit?userId=" + id + "&amount=" + amount + "&token=" + token)
            console.log(res.data)
            const {status, message} = res.data;
            const feed = document.getElementById("fund_feedback")
            if(status === "success"){
                feed.textContent = message;
                feed.style.backgroundColor = "rgba(0, 255, 0, .8)";
                feed.style.color = "#000";
                feed.style.padding = "10px";
                feed.style.textAlign = "center";
                feed.style.margin = "10px auto";
                feed.style.display = "block";
                feed.style.width = "80%";

                setTimeout(() => {
                    window.location.pathname = "/admin/dashboard";
                }, 2000)
            }else {
                feed.textContent = message;
                feed.style.backgroundColor = "rgba(255, 0, 0, .8)";
                feed.style.color = "#000";
                feed.style.padding = "10px";
                feed.style.textAlign = "center";
                feed.style.margin = "10px auto";
                feed.style.display = "block";
                feed.style.width = "80%";
            }

        }else {
            depositAmtFeed.style.color = "red";
            return 
        }
    })
}








if(window.location.pathname === "/admin/referral"){
    refButton.onclick = async e => {
        const parent = e.target.parentNode
        const input = parent.querySelector("[name=referral_url]")
        console.log(parent, input.value)
    
        await navigator.clipboard.writeText(input.value);
        ref_feedback.textContent = "Link copied successfully";
        ref_feedback.style.padding = "12px";
        ref_feedback.style.borderRadius = "4px";
        ref_feedback.style.width = "90%";
        ref_feedback.style.backgroundColor = "rgba(0, 255, 0, .3)";
        ref_feedback.style.display = "block";
    
        setTimeout(() => {
            ref_feedback.style.display = "none";
        }, 5000)
    }
}


if(window.location.pathname === "/admin/withdraw"){
    submitBtn.addEventListener("click", async e => {
        if(withdrawalAmount.value !== ""){
            //submit
            withdrawalAmount.setAttribute("disabled", true);
            btc.setAttribute("disabled", true);
            eth.setAttribute("disabled", true);
            e.target.setAttribute("disabled", true);
            const id = userId.value;
            const amount = withdrawalAmount.value;
            const token = wallet.getAttribute("wallet");
    
            console.log(id, amount, token);
            try{
                const res = await axios.get("http://172.20.10.3:7070/api/withdraw?userId=" + id + "&amount=" + amount + "&token=" + token)
                console.log(res.data)
                const {status, message} = res.data;
                if(status === "success") {
                    feedback.textContent = message;
                    feedback.style.backgroundColor = "rgba(0, 255, 0, .8)";
                    feedback.style.color = "#000";
                    feedback.style.padding = "10px";
                    feedback.style.textAlign = "center";
                    feedback.style.margin = "10px auto";
                    feedback.style.display = "block";
                    feedback.style.width = "80%";
        
                    e.target.removeAttribute("disabled");
                    e.target.textContent = "Back Home";
                    e.target.onclick = e => {
                        window.location.pathname = "/admin/dashboard";
                    }
                } else if(status === "error"){
                    feedback.textContent = message;
                    feedback.style.backgroundColor = "rgba(255, 0, 0, .8)";
                    feedback.style.color = "#fff";
                    feedback.style.padding = "10px";
                    feedback.style.textAlign = "center";
                    feedback.style.margin = "10px auto";
                    feedback.style.display = "block";
                    feedback.style.width = "80%";
                }
            }catch(err){
                feedback.textContent = err.message;
                feedback.style.backgroundColor = "rgba(255, 0, 0, .8)";
                feedback.style.color = "#fff";
                feedback.style.padding = "10px";
                feedback.style.textAlign = "center";
                feedback.style.margin = "10px auto";
                feedback.style.display = "block";
                feedback.style.width = "80%";

                withdrawalAmount.removeAttribute("disabled");
                btc.removeAttribute("disabled");
                eth.removeAttribute("disabled");
                e.target.removeAttribute("disabled");
            }
           
    
        }else {
            feedback.textContent = "Enter the withdrawal amount"
            feedback.style.backgroundColor = "rgba(255, 0, 0, .8)";
            feedback.style.color = "#fff";
            feedback.style.padding = "10px";
            feedback.style.textAlign = "center";
            feedback.style.margin = "10px auto";
            feedback.style.display = "block";
            feedback.style.width = "80%";
        }
    })

    withdrawalAmount.addEventListener("keyup", e => {
        feedback.style.display = "none";
    })
    
    
    btc.addEventListener("change", e => {
        const {checked} = e.target;
        if(checked){
            eth.checked = false;
            wallet.setAttribute("wallet", "btc")
            wallet.value = e.target.getAttribute("address")
        }
    })
    
    eth.addEventListener("change", e => {
        const {checked} = e.target;
        if(checked){
            btc.checked = false;
            wallet.setAttribute("wallet", "eth");
            wallet.value = e.target.getAttribute("address")
        }
    })
}


if(window.location.pathname === "/admin/dashboard"){
    const data = {
        pin: "",
        re_pin: "",
    }
    const button_sec = $("[name=second] .modal-button button");
    const button_third = $("[name=third] .modal-button button");
    // const loader_sec = $(".lds-hourglass");
    $(".section").style.cursor = "not-allowed";
    $(".section .modal").style.cursor = "default";
    $(".modal-button button").addEventListener("click", e => {
        const step = $(".modal-wrap").getAttribute("name");
        if(step === "first"){
            $("[name=first]").style.display = "none";
            $("[name=second]").style.display = "block";
        }
    })
    const loading = e => {
        e.target.textContent = "Creating PIN"
        let i = 1;
        setInterval(() => {
            if(i % 4 === 0){
                e.target.textContent = "Creating PIN"
            }else {
                e.target.textContent += "."
            }
            i++
        }, 1000)
        return e.target.textContent;
    } 

    const updateData = e => {
        const {textContent} = e.target;
        const parent = e.target.parentNode.parentNode;
        
        parent.className === "first"  ?  
        data["pin"] += textContent  :
        data["re_pin"] += textContent
        const next = e.target.nextElementSibling;
        e.target.textContent = ".";
        if(next){
            next.focus()
        }else {
            e.target.blur();
            if(data.pin === data.re_pin && parent.className === "second"){
                button_sec.removeAttribute("disabled");
            }else {
                // alert("Both pins don't match")
                const div = document.createElement("div");
                div.style.position = "fixed";
                div.style.top = 0;
                div.style.left = 0;
                div.style.zIndex = 2003;
                div.style.width = "100%";
                div.style.padding = "10px";
                div.innerHTML = `<p style="margin: 0">Both pins don't match</p>`;
                div.style.textAlign = "center";
                div.style.letterSpacing = "0.8px";
                div.style.color = "#fff";
                div.style.backgroundColor = "red";
                $("body").appendChild(div);
                setTimeout(() => {
                    div.style.display = "none";
                }, 1500)
            }
            return 
        }
    }
    $("[name=second]").querySelectorAll(".first .modal-body-data div").forEach(d => {
        d.addEventListener("keyup", updateData)
    })
    $("[name=second]").querySelectorAll(".second .modal-body-data div").forEach(d => {
        d.addEventListener("keyup", updateData)
    })
    $("[name=second]").querySelectorAll(".first .modal-body-data div").forEach(d => {
        d.addEventListener("click", e => {
            console.log(e.target);
            e.target.addEventListener("keyup", e => {
                console.log(e.target);
                const next = e.target.nextElementSibling;
                const prev = e.target.previousElementSibling
                if(e.keyCode === 8 || e.which === 8){
                    console.log("You  pressed the delete button", next, prev)
                    e.target.textContent = "";
                    if(prev){
                        e.target.blur();
                        prev.focus();
                    }
                }
            })

        })
    })


    button_third.addEventListener("click", async e => {
        console.log(profileData);
        e.target.setAttribute("disabled", true);
        const loading = e => {
            e.target.textContent = "Updating Profile"
            let i = 1;
            setInterval(() => {
                if(i % 4 === 0){
                    e.target.textContent = "Updating Profile"
                }else {
                    e.target.textContent += "."
                }
                i++
            }, 1000)
            return e.target.textContent;
        } 
        e.target.textContent = loading(e);
        try{
            const {phone, day, month, year} = profileData;
            const formdata = `?phone=${phone}&dob=${day}-${month}-${year}`;
            const res = await axios.get("http://localhost:7070/api/update-profile" + formdata);
            console.log(res.data)
            const {status, message} = res.data;
            const div = document.createElement("div");
            div.style.position = "fixed";
            div.style.top = 0;
            div.style.left = 0;
            div.style.zIndex = 2003;
            div.style.width = "100%";
            div.style.padding = "10px";
            div.innerHTML = `<p style="margin: 0">${message}</p>`;
            div.style.textAlign = "center";
            div.style.letterSpacing = "0.8px";
            div.style.color = "#fff";
            if(status === "success"){
                div.style.backgroundColor = "green";
                $("body").appendChild(div);
                setTimeout(() => {
                   $(".section").parentNode.removeChild($(".section"));
                   window.location.reload();
                }, 2000)
            }else {
                div.style.backgroundColor = "red";
                $("body").appendChild(div);
                setTimeout(() => {
                    e.target.removeAttribute("disabled");
                    e.target.textContent = "Update";
                }, 2000)

            }
        }catch(err){
            console.log(err.message)
        }
    })
    const profileData = {
        phone: "",
        day: "",
        month: "",
        year: ""
    }
    $(".number input").addEventListener("keyup", e => {
        const {name, value} = e.target;
        profileData[name] = value;
    })
    $(".modal-body-input").querySelectorAll("input").forEach(f => {
        f.addEventListener("keyup", e => {
            const {name, value} = e.target;
            const next = e.target.nextElementSibling;
            const {phone, day, month, year} = profileData;
            if(phone.length === 11 && day.length === 2 && month.length === 2  && year.length === 4 ){
                button_third.removeAttribute("disabled");
            }else {
                button_third.setAttribute("disabled", true);
            }
            if(name === "day"){
                if(value.length > 2){
                    e.target.value = profileData[name];
                    next.focus();
                }else {
                    profileData[name] = value;
                }
            }else if(name === "month"){
                if(value.length > 2){
                    e.target.value = profileData[name];
                    next.focus();
                }else {
                    profileData[name] = value;
                }
            }else{
                if(value.length > 4){
                    e.target.value = profileData[name];
                }else {
                    profileData[name] = value;
                }
            }
        })    
    })

    button_sec.addEventListener("click", async e => {
        e.target.setAttribute("disabled", true);
        e.target.textContent = loading(e);
        try{
            const formdata = `?pin=${data.pin}`
            const res = await axios.get("http://localhost:7070/api/update-profile" + formdata);
            console.log(res.data)
            const {status, message} = res.data;
            const div = document.createElement("div");
            div.style.position = "fixed";
            div.style.top = 0;
            div.style.left = 0;
            div.style.zIndex = 2003;
            div.style.width = "100%";
            div.style.padding = "10px";
            div.innerHTML = `<p style="margin: 0">${message}</p>`;
            div.style.textAlign = "center";
            div.style.letterSpacing = "0.8px";
            div.style.color = "#fff";
            if(status === "success"){
                div.style.backgroundColor = "green";
                $("body").appendChild(div);
                setTimeout(() => {
                    $("[name=second]").style.display = "none";
                    div.style.display = "none";
                    $("[name=third]").style.display = "block";
                }, 2000)
            }else {
                div.style.backgroundColor = "red";
                $("body").appendChild(div);
                setTimeout(() => {
                    e.target.removeAttribute("disabled");
                    e.target.textContent = "Create PIN";
                }, 2000)

            }
        }catch(err){
            console.log(err.message)
        }
    })
}