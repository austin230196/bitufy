const $ = sel => document.querySelector(sel);

checkbox = $("[name=checked]"),

loader = $(".loader");



const Alert = (message, mode, target) => {
    $(target).style.display = "block";
    $(target).style.letterSpacing = "0.5px";
    $(target).style.width = "100%";
    $(target).style.fontSize = "0.7rem";
    if(mode === "success"){
        $(target).innerHTML = `<em><i class="fas fa-check"></i> &nbsp; <span>${message}</span></em>`;
        $(target).style.color = "rgb(0, 200, 0)";
    } else if(mode === "error"){
        $(target).innerHTML = `<em><i class="fas fa-info"></i> &nbsp; <span>${message}</span></em>`;
        $(target).style.color = "rgb(200, 0, 0)";
    }
}

if(window.location.pathname === "/auth/signup"){
    const form = $("form");
    const data = {
        _csrf: $("[name=_csrf]").value,
        first_name: "",
        other_names: "",
        email: "",
        username: "",
        bitcoin: "",
        password: "",
        re_password: "",
        code: "",
    }
    form.querySelectorAll("input").forEach((sin, i) => {
        sin.addEventListener("keyup", e => {
            const {name, value} = e.target;
            data[name] = value;
        })
    })
    $("select").addEventListener("change", async e => {
        const {name, value} = e.target;
        data[name] = value;
    })
    form.addEventListener("submit", async e => {
        e.preventDefault();
        $(".loader").style.display = "block";
        $(".loader").style.display = "flex";
        $(".loader").style.alignItems = "center";
        $(".loader").style.flexDirection = "column";
        $(".loader").style.justifyContent = "center";
        if(data.password !== data.re_password){
            //do some stuffs but we don't continue
            $(".loader").style.display = "none";
            Alert("Passwords don't match", "error", ".signup_feedback");
        }else {
            //we continue
            try {
                const res = await axios.post("http://localhost:7070/auth/signup", data);
                const {status, message, statusCode} = res.data;
                if(status === "error"){
                    $(".loader").style.display = "none";
                    Alert(message, "error", ".signup_feedback");
                }else if(status === "success"){
                    $(".signup_feedback").style.display = "none";
                    window.location.pathname = "/auth/verify";
                }
            }catch(err){
                Alert(err.message, "error", ".signup_feedback");
            }
        }
    })
}



if(window.location.pathname === "/auth/login"){
    const data = {
        _csrf: $("[name=_csrf]").value,
        email: "",
        password: ""
    }
    $("form").querySelectorAll("input").forEach((lin, i) => {
        lin.addEventListener("keyup", e => {
            const {name, value} = e.target;
            data[name] = value;
        })
    })
    $("form").addEventListener("submit", async e => {
        e.preventDefault();
        $(".loader").style.display = "block";
        $(".loader").style.display = "flex";
        $(".loader").style.alignItems = "center";
        $(".loader").style.flexDirection = "column";
        $(".loader").style.justifyContent = "center";
        try {
            const res = await axios.post("http://localhost:7070/auth/login", data);
            const {status, message, statusCode} = res.data;
            if(status === "error"){
                $(".loader").style.display = "none";
                Alert(message, "error", ".signup_feedback");
            }else if(status === "success"){
                $(".signup_feedback").style.display = "none";
                message.verified ? 
                window.location.pathname = "/admin/dashboard" :
                window.location.pathname = "/auth/verify"
            }
        }catch(err){
            Alert(err.message, "error", ".signup_feedback");
        }
    })
}


if(window.location.pathname === "/auth/verify"){
    $(".resend").addEventListener("click", async e => {
        if(e.target.getAttribute("disabled")){
            $("#verify").style.display = "block";
            $("#verify").style.textAlign = "center";
            $("#verify").style.letterSpacing = "0.5px";
            $("#verify").classList.remove("alert-success")
            $("#verify").classList.add("alert-danger")
            $("#verify").textContent = "Email has already been sent to your inbox";
            return;
        }else {
            e.target.setAttribute("disabled", true);
            e.target.style.cursor = "not-allowed";
            try{
                const res = await axios.get("http://localhost:7070/api/resend-mail");
                const {status, statusCode, message} = res.data;
                $("#verify").style.display = "block";
                $("#verify").style.textAlign = "center";
                $("#verify").style.letterSpacing = "0.5px";
                if(status === "success"){
                    $("#verify").classList.remove("alert-danger")
                    $("#verify").classList.add("alert-success")
                    $("#verify").textContent = message;
                }else if(status === "error"){
                    $("#verify").classList.remove("alert-success")
                    $("#verify").classList.add("alert-danger")
                    $("#verify").textContent = message;
                }
            }catch(err){
                $("#verify").style.display = "block";
                $("#verify").classList.remove("alert-success")
                $("#verify").classList.add("alert-danger")
                $("#verify").textContent = err.message;
            }
        }
        
    })
}


// const loginValidations = {
//     email: {
//         name: "email",
//         check: /^\S+@\S+\.\S+$/i,
//     },
//     password: {
//         name: "password",
//         check: /^\w{5,}$/i,
//     }
// }

// const validations = {
//     full_name: {
//         name: "full_name",
//         check: /^\w{5,}$/i,
//     },
//     email: {
//         name: "email",
//         check: /^\S+@\S+\.\S+$/i,
//     },
//     username: {
//         name: "username",
//         check: /\w{5,}/i,
//     },
//     bitcoin: {
//         name: "bitcoin",
//         check: /\w{20,}/i,
//     },
//     ethereum: {
//         name: "ethereum",
//         check: /\w{20,}/i,
//     },
//     password: {
//         name: "password",
//         check: /^\w{5,}$/i,
//     },
//     phone: {
//         name: "phone",
//         check: /[0-9]{11}/i
//     }
// }


/**
 * We need to write a function that tracks each input as you type 
 * it validates your input
 */


/**
 * 
 * @param {Node} e 
 * This function takes care of the password input visibility
 */
function toggleVission(e){
    const parent = e.parentNode,
    input = parent.querySelector("input");

    //first we check if the type of the input
    if(input.type === "password") {
        e.className = "fas fa-eye-slash";
        input.type = "text";
    } else {
        e.className = "fas fa-eye";
        input.type = "password";
    }
}
