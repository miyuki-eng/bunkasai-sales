// ==================================================
// 文化祭 売上管理
// パスワードガード
// ==================================================

console.log("🔐 guard.js 読み込み成功");

const isLoggedIn =
    sessionStorage.getItem(
        "salesSystemLogin"
    ) === "true";

if (!isLoggedIn) {
    window.location.replace(
        "password.html"
    );
}
