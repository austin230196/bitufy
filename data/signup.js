const inputData = [
    {
        name: "first_name",
        id: "first_name",
        placeholder: "First Name*",
        type: "text",
        icon: "fas fa-user" ,
        required: true,
    },
    {
        name: "other_names",
        id: "other_names",
        placeholder: "Other Names*",
        type: "text",
        icon: "fas fa-user" ,
        required: true,
    },
    {
        name: "email",
        id: "email",
        placeholder: "Email*",
        type: "email",
        icon: "fas fa-envelope" ,
        required: true,
    },
    {
        name: "username",
        id: "username",
        placeholder: "Username*",
        type: "text",
        icon: "fas fa-user-secret" ,
        required: true,
    },
    {
        name: "bitcoin",
        id: "bitcoin",
        placeholder: "Bitcoin*",
        type: "text",
        icon: "fab fa-bitcoin" ,
        required: false,
    },
    {
        name: "password",
        id: "password",
        placeholder: "Password*",
        type: "password",
        icon: "fas fa-lock",
        s_icon: true,
        required: true,
    },
    {
        name: "re_password",
        id: "re_password",
        placeholder: "Confirm Password*",
        type: "password",
        icon: "fas fa-lock",
        s_icon: true,
        required: true,
    },
]


module.exports = {inputData}