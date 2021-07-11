const inputData = [
    {
        name: "first_name",
        placeholder: "First Name*",
        type: "text",
        icon: "fas fa-user" ,
        required: true,
    },
    {
        name: "other_names",
        placeholder: "Other Names*",
        type: "text",
        icon: "fas fa-user" ,
        required: true,
    },
    {
        name: "email",
        placeholder: "Email*",
        type: "email",
        icon: "fas fa-envelope" ,
        required: true,
    },
    {
        name: "username",
        placeholder: "Username*",
        type: "text",
        icon: "fas fa-user-secret" ,
        required: true,
    },
    {
        name: "bitcoin",
        placeholder: "Bitcoin*",
        type: "text",
        icon: "fab fa-bitcoin" ,
        required: false,
    },
    {
        name: "ethereum",
        placeholder: "Ethereum*",
        type: "text",
        icon: "fab fa-ethereum" ,
        required: false,
    },
]


module.exports = {inputData}