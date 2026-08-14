// ==================================================
// 売上登録
// Firebase Realtime Database版
// ==================================================

import {
    db,
    auth,
    signInAnonymously
} from "./firebase.js";

import {
    ref,
    get,
    push,
    set
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-database.js";


// ==================================================
// データ
// ==================================================

let events = [];
let creators = [];
let products = [];


// ==================================================
// HTML要素
// ==================================================

const eventSelect =
    document.getElementById("eventSelect");

const daySelect =
    document.getElementById("daySelect");

const creatorSelect =
    document.getElementById("creatorSelect");

const productSelect =
    document.getElementById("productSelect");

const quantityInput =
    document.getElementById("quantityInput");

const unitPrice =
    document.getElementById("unitPrice");

const totalPrice =
    document.getElementById("totalPrice");

const registerButton =
    document.getElementById("registerButton");

const registerMessage =
    document.getElementById("registerMessage");


// ==================================================
// Firebase匿名ログイン
// ==================================================

async function login() {

    try {

        if (!auth.currentUser) {

            await signInAnonymously(auth);

        }

        console.log(
            "Firebase匿名ログイン成功"
        );

    } catch (error) {

        console.error(
            "Firebase匿名ログイン失敗:",
            error
        );

        alert(
            "Firebaseへの接続に失敗しました。"
        );

        throw error;

    }

}


// ==================================================
// Firebaseからデータを読み込む
// ==================================================

async function loadData() {

    try {

        // ==================================================
        // 文化祭
        // ==================================================

        const eventsSnapshot =
            await get(
                ref(db, "events")
            );

        const eventsData =
            eventsSnapshot.val();


        if (eventsData) {

            events =
                Object.entries(eventsData).map(
                    function ([id, data]) {

                        return {
                            id: id,
                            ...data
                        };

                    }
                );

        } else {

            events = [];

        }


        // ==================================================
        // 制作者
        // ==================================================

        const creatorsSnapshot =
            await get(
                ref(db, "creators")
            );

        const creatorsData =
            creatorsSnapshot.val();


        if (creatorsData) {

            creators =
                Object.entries(creatorsData).map(
                    function ([id, data]) {

                        return {
                            id: id,
                            ...data
                        };

                    }
                );

        } else {

            creators = [];

        }


        // ==================================================
        // 商品
        // ==================================================

        const productsSnapshot =
            await get(
                ref(db, "products")
            );

        const productsData =
            productsSnapshot.val();


        if (productsData) {

            products =
                Object.entries(productsData).map(
                    function ([id, data]) {

                        return {
                            id: id,
                            ...data
                        };

                    }
                );

        } else {

            products = [];

        }


        // ==================================================
        // 確認
        // ==================================================

        console.log(
            "Firebaseデータ読み込み完了"
        );

        console.log(
            "events:",
            events
        );

        console.log(
            "creators:",
            creators
        );

        console.log(
            "products:",
            products
        );


    } catch (error) {

        console.error(
            "データ読み込みエラー:",
            error
        );

        alert(
            "Firebaseからデータを読み込めませんでした。"
        );

        throw error;

    }

}


// ==================================================
// 文化祭表示
// ==================================================

function displayEvents() {

    eventSelect.innerHTML = `
        <option value="">
            開催イベントを選択
        </option>
    `;


    events.forEach(
        function (event) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                String(event.id);


            option.textContent =
                event.name ||
                "名称未設定";


            eventSelect.appendChild(
                option
            );

        }
    );

}


// ==================================================
// 開催日表示
// ==================================================

function displayDays() {

    const selectedEventId =
        eventSelect.value;


    daySelect.innerHTML = `
        <option value="">
            開催日を選択
        </option>
    `;


    if (!selectedEventId) {

        return;

    }


    const event =
        events.find(
            function (event) {

                return String(event.id) ===
                    String(selectedEventId);

            }
        );


    if (!event) {

        return;

    }


    const days =
        Number(event.days);


    for (
        let day = 1;
        day <= days;
        day++
    ) {

        const option =
            document.createElement(
                "option"
            );


        option.value =
            String(day);


        option.textContent =
            `${day}日目`;


        daySelect.appendChild(
            option
        );

    }

}


// ==================================================
// 制作者表示
// ==================================================

function displayCreators() {

    const selectedEventId =
        eventSelect.value;


    creatorSelect.innerHTML = `
        <option value="">
            制作者を選択
        </option>
    `;


    productSelect.innerHTML = `
        <option value="">
            商品を選択
        </option>
    `;


    resetPrice();


    if (!selectedEventId) {

        return;

    }


    const eventCreators =
        creators.filter(
            function (creator) {

                return String(
                    creator.eventId
                ) ===
                String(
                    selectedEventId
                );

            }
        );


    eventCreators.forEach(
        function (creator) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                String(creator.id);


            option.textContent =
                creator.name;


            creatorSelect.appendChild(
                option
            );

        }
    );

}


// ==================================================
// 商品表示
// ==================================================

function displayProducts() {

    const selectedEventId =
        eventSelect.value;


    const selectedCreatorId =
        creatorSelect.value;


    productSelect.innerHTML = `
        <option value="">
            商品を選択
        </option>
    `;


    resetPrice();


    if (
        !selectedEventId ||
        !selectedCreatorId
    ) {

        return;

    }


    const eventProducts =
        products.filter(
            function (product) {

                return (

                    String(
                        product.eventId
                    ) ===
                    String(
                        selectedEventId
                    )

                    &&

                    String(
                        product.creatorId
                    ) ===
                    String(
                        selectedCreatorId
                    )

                );

            }
        );


    eventProducts.forEach(
        function (product) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                String(product.id);


            option.textContent =
                product.productName;


            productSelect.appendChild(
                option
            );

        }
    );

}


// ==================================================
// 商品変更
// ==================================================

productSelect.addEventListener(
    "change",
    function () {

        displayPrice();

        calculateTotal();

        registerMessage.textContent =
            "";

    }
);


// ==================================================
// 単価表示
// ==================================================

function displayPrice() {

    const selectedProductId =
        productSelect.value;


    const product =
        products.find(
            function (item) {

                return String(
                    item.id
                ) ===
                String(
                    selectedProductId
                );

            }
        );


    if (product) {

        unitPrice.textContent =
            `￥${Number(
                product.price
            ).toLocaleString()}`;

    } else {

        unitPrice.textContent =
            "￥0";

    }

}


// ==================================================
// 個数入力
// ==================================================

quantityInput.addEventListener(
    "input",
    calculateTotal
);


function calculateTotal() {

    const selectedProductId =
        productSelect.value;


    const quantity =
        Number(
            quantityInput.value
        );


    const product =
        products.find(
            function (item) {

                return String(
                    item.id
                ) ===
                String(
                    selectedProductId
                );

            }
        );


    if (
        !product ||
        quantity <= 0
    ) {

        totalPrice.textContent =
            "￥0";

        return;

    }


    const total =
        Number(product.price) *
        quantity;


    totalPrice.textContent =
        `￥${total.toLocaleString()}`;

}


// ==================================================
// 文化祭変更
// ==================================================

eventSelect.addEventListener(
    "change",
    function () {

        registerMessage.textContent =
            "";

        displayDays();

        displayCreators();

    }
);


// ==================================================
// 制作者変更
// ==================================================

creatorSelect.addEventListener(
    "change",
    function () {

        registerMessage.textContent =
            "";

        displayProducts();

    }
);


// ==================================================
// 金額リセット
// ==================================================

function resetPrice() {

    productSelect.value =
        "";

    quantityInput.value =
        "";

    unitPrice.textContent =
        "￥0";

    totalPrice.textContent =
        "￥0";

}


// ==================================================
// 売上登録
// ==================================================

registerButton.addEventListener(
    "click",
    async function () {

        // ==================================================
        // 二重登録防止
        // ==================================================

        if (
            registerButton.disabled
        ) {

            return;

        }


        // ==================================================
        // 入力値
        // ==================================================

        const eventId =
            eventSelect.value;


        const day =
            Number(
                daySelect.value
            );


        const creatorId =
            creatorSelect.value;


        const productId =
            productSelect.value;


        const quantity =
            Number(
                quantityInput.value
            );


        // ==================================================
        // 入力チェック
        // ==================================================

        if (!eventId) {

            alert(
                "開催イベントを選択してください。"
            );

            return;

        }


        if (!day) {

            alert(
                "開催日を選択してください。"
            );

            return;

        }


        if (!creatorId) {

            alert(
                "制作者を選択してください。"
            );

            return;

        }


        if (!productId) {

            alert(
                "商品を選択してください。"
            );

            return;

        }


        if (
            !Number.isInteger(quantity) ||
            quantity <= 0
        ) {

            alert(
                "個数を1個以上入力してください。"
            );

            return;

        }


        // ==================================================
        // イベント取得
        // ==================================================

        const event =
            events.find(
                function (item) {

                    return String(
                        item.id
                    ) ===
                    String(
                        eventId
                    );

                }
            );


        if (!event) {

            alert(
                "文化祭の情報が見つかりません。"
            );

            return;

        }


        // ==================================================
        // 制作者取得
        // ==================================================

        const creator =
            creators.find(
                function (item) {

                    return String(
                        item.id
                    ) ===
                    String(
                        creatorId
                    );

                }
            );


        if (!creator) {

            alert(
                "制作者の情報が見つかりません。"
            );

            return;

        }


        // ==================================================
        // 商品取得
        // ==================================================

        const product =
            products.find(
                function (item) {

                    return String(
                        item.id
                    ) ===
                    String(
                        productId
                    );

                }
            );


        if (!product) {

            alert(
                "商品の情報が見つかりません。"
            );

            return;

        }


        // ==================================================
        // 金額計算
        // ==================================================

        const price =
            Number(
                product.price
            );


        const total =
            price * quantity;


        // ==================================================
        // 確認
        // ==================================================

        const confirmMessage =

            `以下の内容で売上を登録しますか？\n\n` +

            `文化祭：${event.name}\n` +

            `開催日：${day}日目\n` +

            `制作者：${creator.name}\n` +

            `商品：${product.productName}\n` +

            `個数：${quantity}個\n` +

            `単価：￥${price.toLocaleString()}\n` +

            `売上：￥${total.toLocaleString()}`;


        if (
            !confirm(
                confirmMessage
            )
        ) {

            return;

        }


        // ==================================================
        // 登録中
        // ==================================================

        registerButton.disabled =
            true;


        registerButton.textContent =
            "⏳ 登録中...";


        try {

            // ==================================================
            // 売上データ
            // ==================================================

            const saleData = {

                eventId:
                    eventId,

                eventName:
                    event.name,

                day:
                    day,

                creatorId:
                    creatorId,

                creatorName:
                    creator.name,

                productId:
                    productId,

                productName:
                    product.productName,

                quantity:
                    quantity,

                unitPrice:
                    price,

                total:
                    total,

                timestamp:
                    new Date().toISOString()

            };


            // ==================================================
            // Realtime Database
            // sales/{自動ID}
            // ==================================================

            const salesRef =
                push(
                    ref(db, "sales")
                );


            await set(
                salesRef,
                saleData
            );


            // ==================================================
            // 完了
            // ==================================================

            console.log(
                "売上登録成功:",
                salesRef.key,
                saleData
            );


            registerMessage.textContent =
                "✅ 売上をFirebaseに登録しました！";


            // 入力リセット

            resetPrice();


        } catch (error) {

            console.error(
                "売上登録エラー:",
                error
            );


            alert(
                "売上をFirebaseに登録できませんでした。"
            );

        } finally {

            registerButton.disabled =
                false;


            registerButton.textContent =
                "➕ 登録する";

        }

    }
);


// ==================================================
// 初期化
// ==================================================

async function initialize() {

    try {

        // Firebaseログイン

        await login();


        // データ読み込み

        await loadData();


        // 初期表示

        displayEvents();

        displayDays();

        displayCreators();

        displayProducts();


        console.log(
            "売上登録ページ初期化完了"
        );


    } catch (error) {

        console.error(
            "初期化エラー:",
            error
        );

    }

}


// ==================================================
// 開始
// ==================================================

initialize();