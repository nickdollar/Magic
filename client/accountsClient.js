
var mySubmitFunc = function(error, state){
    if (!error) {
        if (state === "signIn") {
            $('#loginModal').modal('toggle');
        }
        if (state === "signUp") {
            $('#loginModal').modal('toggle');
        }
    }
};


var myLogoutFunc = function(){

};

AccountsTemplates.configure({
    confirmPassword: false,
    privacyUrl: 'privacy',
    onLogoutHook: myLogoutFunc,
    onSubmitHook : mySubmitFunc
});

AccountsTemplates.addFields([
    {
        _id: 'firstName',
        type : 'text',
        displayName: 'First Name'
    }
]);

