var URL = "https://fir-1c7de-default-rtdb.firebaseio.com/ngoManagment";
function checkIsNull(value) {
    return value === "" || value === undefined || value === null ? true : false;
}
function loginUser() {
    let requestBody = {
        "emailId": $("#emailId").val(),
        "password": $("#pwdId").val()
    }
    if (checkIsNull($("#emailId").val()) || checkIsNull($("#pwdId").val())) {
        alert("Please fill all Data");
    } else {
        $.ajax({
            type: 'get',
            contentType: "application/json",
            dataType: 'json',
            cache: false,
            url: URL + "/userRegister.json",
            data: JSON.stringify(requestBody),
            success: function (lresponse) {
                let loginUserList = [];
                for (let i in lresponse) {
                    let data = lresponse[i];
                    data["userId"] = i;
                    loginUserList.push(data);
                }
                let isValid = false;
                for (let i = 0; i < loginUserList.length; i++) {
                    if (loginUserList[i].userEmailId == $("#emailId").val() && loginUserList[i].passwordId == $("#pwdId").val()) {
                        isValid = true;
                        localStorage.setItem("userDetails", JSON.stringify(loginUserList[i]));
                        window.location.href = "NgoHome.html";

                    }
                }
                if (!isValid) {
                    alert("User not found");
                }
            }, error: function (error) {
                alert("Something went wrong");
            }
        });
    }
}
function registerUser() {
    if (checkIsNull($("#memberNameId").val()) || checkIsNull($("#userEmailId").val())
        || checkIsNull($("#passwordId").val()) || checkIsNull($("#contactId").val())
        || checkIsNull($("#userType").val())) {
        alert("Please fill all the details for registration");
    } else {
        let requestBody = {
            "userFullName": $("#memberNameId").val(),
            "userType": $("#userType").val(),
            "userEmailId": $("#userEmailId").val(),
            "passwordId": $("#passwordId").val(),
            "contactId": $("#contactId").val(),
        }

        $.ajax({
            type: 'post',
            contentType: "application/json",
            dataType: 'json',
            cache: false,
            cache: false,
            url: URL + "/userRegister.json",
            data: JSON.stringify(requestBody),
            success: function (lresponse) {
                $('#regModelId').modal('hide');
                alert("Registerd sucessfully!!!");
            }, error: function (error) {
                alert("Something went wrong");
            }
        });
    }
}

function resetData() {
    $("#memberNameId").val("");
    $("#userEmailId").val("");
    $("#passwordId").val("");
    $("#contactId").val("");
    $("#userType").val();
}
$(document).ready(function () {
    $('#regModelId').on('hidden.bs.modal', function (e) {
        resetData();
    })
    $("#isTrainer").change(function () {
        if (this.checked) {
            $("#customerDetailsId").hide();
        } else {
            $("#customerDetailsId").show();
        }
    })
});
