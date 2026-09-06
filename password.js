// ==================================================
// 文化祭 売上管理
// パスワード設定
// ==================================================


// ==================================================
// ★ここを好きなパスワードに変更
// ==================================================

const SALES_PASSWORD = "craftsales";


// ==================================================
// HTML要素
// ==================================================

const loginForm =
    document.getElementById("loginForm");

const passwordInput =
    document.getElementById("password");

const errorMessage =
    document.getElementById("errorMessage");


// ==================================================
// ログイン済みか確認
// ==================================================

if (
    sessionStorage.getItem(
        "salesSystemLogin"
    ) === "true"
) {

    window.location.replace(
        "index.html"
    );

}


// ==================================================
// ログイン処理
// ==================================================

loginForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const enteredPassword =
            passwordInput.value;


        // ==================================================
        // パスワード確認
        // ==================================================

        if (
            enteredPassword ===
            SALES_PASSWORD
        ) {

            // ログイン状態を保存

            sessionStorage.setItem(
                "salesSystemLogin",
                "true"
            );


            // 売上管理へ

            window.location.replace(
                "index.html"
            );


        } else {

            // 間違っていた場合

            errorMessage.textContent =
                "❌ パスワードが違います。";


            passwordInput.value =
                "";


            passwordInput.focus();

        }

    }
);