// ==================================================
// 商品・制作者管理
// Firebase Realtime Database 完全版
// ==================================================


import {
    db,
    auth
} from "./firebase.js";


import {
    ref,
    get,
    set,
    push,
    update,
    remove
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-database.js";


import {
    signInAnonymously
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";


// ==================================================
// データ
// ==================================================

let events = [];

let creators = [];

let products = [];


// ==================================================
// HTML要素
// ==================================================

// ------------------------------
// 文化祭
// ------------------------------

const eventNameInput =
    document.getElementById(
        "eventNameInput"
    );

const eventDaysInput =
    document.getElementById(
        "eventDaysInput"
    );

const addEventButton =
    document.getElementById(
        "addEventButton"
    );

const eventMessage =
    document.getElementById(
        "eventMessage"
    );

const eventList =
    document.getElementById(
        "eventList"
    );

const eventSelect =
    document.getElementById(
        "eventSelect"
    );


// ------------------------------
// 制作者
// ------------------------------

const creatorInput =
    document.getElementById(
        "creatorInput"
    );

const addCreatorButton =
    document.getElementById(
        "addCreatorButton"
    );

const creatorMessage =
    document.getElementById(
        "creatorMessage"
    );

const creatorList =
    document.getElementById(
        "creatorList"
    );


// ------------------------------
// 商品
// ------------------------------

const productEventSelect =
    document.getElementById(
        "productEventSelect"
    );

const productCreatorSelect =
    document.getElementById(
        "productCreatorSelect"
    );

const productInput =
    document.getElementById(
        "productInput"
    );

const priceInput =
    document.getElementById(
        "priceInput"
    );

const addProductButton =
    document.getElementById(
        "addProductButton"
    );

const productMessage =
    document.getElementById(
        "productMessage"
    );

const productList =
    document.getElementById(
        "productList"
    );


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
// Firebaseからデータ読み込み
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
                Object.entries(
                    eventsData
                ).map(
                    function([id, data]) {

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
                Object.entries(
                    creatorsData
                ).map(
                    function([id, data]) {

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
                Object.entries(
                    productsData
                ).map(
                    function([id, data]) {

                        return {

                            id: id,

                            ...data

                        };

                    }
                );

        } else {

            products = [];

        }


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
// 文化祭選択欄を表示
// ==================================================

function displayEvents() {

    // ------------------------------
    // 制作者管理用
    // ------------------------------

    eventSelect.innerHTML = `
        <option value="">
            開催イベントを選択
        </option>
    `;


    // ------------------------------
    // 商品登録用
    // ------------------------------

    productEventSelect.innerHTML = `
        <option value="">
            文化祭を選択
        </option>
    `;


    events.forEach(
        function(event) {

            // ------------------------------
            // 制作者管理用
            // ------------------------------

            const option1 =
                document.createElement(
                    "option"
                );


            option1.value =
                event.id;


            option1.textContent =
                event.name;


            eventSelect.appendChild(
                option1
            );


            // ------------------------------
            // 商品登録用
            // ------------------------------

            const option2 =
                document.createElement(
                    "option"
                );


            option2.value =
                event.id;


            option2.textContent =
                event.name;


            productEventSelect.appendChild(
                option2
            );

        }
    );


    console.log(
        "文化祭選択欄を更新:",
        events.length
    );

}


// ==================================================
// 文化祭一覧
// ==================================================

function displayEventList() {

    eventList.innerHTML = "";


    if (events.length === 0) {

        eventList.innerHTML = `
            <p>
                文化祭が登録されていません。
            </p>
        `;

        return;

    }


    events.forEach(
        function(event) {

            const eventItem =
                document.createElement(
                    "div"
                );


            eventItem.className =
                "event-item";


            const eventInfo =
                document.createElement(
                    "div"
                );


            eventInfo.innerHTML = `
                <strong>
                    🎪 ${event.name}
                </strong>

                <span>
                    ${event.days}日間
                </span>
            `;


            const buttonArea =
                document.createElement(
                    "div"
                );


            // ------------------------------
            // 編集
            // ------------------------------

            const editButton =
                document.createElement(
                    "button"
                );


            editButton.textContent =
                "✏️";


            editButton.title =
                "文化祭を編集";


            editButton.addEventListener(
                "click",
                function() {

                    editEvent(
                        event.id
                    );

                }
            );


            // ------------------------------
            // 削除
            // ------------------------------

            const deleteButton =
                document.createElement(
                    "button"
                );


            deleteButton.textContent =
                "🗑️";


            deleteButton.title =
                "文化祭を削除";


            deleteButton.addEventListener(
                "click",
                function() {

                    deleteEvent(
                        event.id
                    );

                }
            );


            buttonArea.appendChild(
                editButton
            );


            buttonArea.appendChild(
                deleteButton
            );


            eventItem.appendChild(
                eventInfo
            );


            eventItem.appendChild(
                buttonArea
            );


            eventList.appendChild(
                eventItem
            );

        }
    );

}


// ==================================================
// 文化祭登録
// ==================================================

addEventButton.addEventListener(
    "click",
    async function() {

        const name =
            eventNameInput.value.trim();


        const days =
            Number(
                eventDaysInput.value
            );


        // ------------------------------
        // 入力チェック
        // ------------------------------

        if (!name) {

            alert(
                "文化祭名を入力してください。"
            );

            return;

        }


        if (
            !Number.isInteger(days) ||
            days < 1 ||
            days > 3
        ) {

            alert(
                "開催日数を正しく選択してください。"
            );

            return;

        }


        // ------------------------------
        // 重複チェック
        // ------------------------------

        const alreadyExists =
            events.some(
                function(event) {

                    return (
                        event.name === name
                    );

                }
            );


        if (alreadyExists) {

            alert(
                "同じ文化祭名がすでに登録されています。"
            );

            return;

        }


        // ------------------------------
        // 確認
        // ------------------------------

        const confirmed =
            confirm(
                `「${name}」を登録しますか？\n\n開催日数：${days}日`
            );


        if (!confirmed) {

            return;

        }


        try {

            const eventsRef =
                ref(
                    db,
                    "events"
                );


            const newEventRef =
                push(
                    eventsRef
                );


            const newEvent = {

                name: name,

                days: days

            };


            await set(
                newEventRef,
                newEvent
            );


            events.push({

                id: newEventRef.key,

                ...newEvent

            });


            eventNameInput.value = "";

            eventDaysInput.value = "2";


            eventMessage.textContent =
                "✅ 文化祭を登録しました！";


            displayEvents();

            displayEventList();


            console.log(
                "文化祭登録成功:",
                newEventRef.key
            );


        } catch (error) {

            console.error(
                "文化祭登録エラー:",
                error
            );


            alert(
                "文化祭を登録できませんでした。"
            );

        }

    }
);


// ==================================================
// 文化祭編集
// ==================================================

async function editEvent(eventId) {

    const event =
        events.find(
            function(event) {

                return (
                    String(event.id) ===
                    String(eventId)
                );

            }
        );


    if (!event) {

        return;

    }


    const newName =
        prompt(
            "文化祭名を入力してください。",
            event.name
        );


    if (newName === null) {

        return;

    }


    const name =
        newName.trim();


    if (!name) {

        alert(
            "文化祭名を入力してください。"
        );

        return;

    }


    const newDays =
        prompt(
            "開催日数を入力してください。",
            event.days
        );


    if (newDays === null) {

        return;

    }


    const days =
        Number(newDays);


    if (
        !Number.isInteger(days) ||
        days < 1 ||
        days > 3
    ) {

        alert(
            "開催日数は1～3で入力してください。"
        );

        return;

    }


    try {

        await update(
            ref(
                db,
                "events/" + eventId
            ),
            {

                name: name,

                days: days

            }
        );


        eventMessage.textContent =
            "✅ 文化祭を編集しました！";


        await loadData();


        displayEvents();

        displayEventList();

        displayCreators();

        displayProductCreators();


    } catch (error) {

        console.error(
            "文化祭編集エラー:",
            error
        );


        alert(
            "文化祭の編集に失敗しました。"
        );

    }

}


// ==================================================
// 文化祭削除
// ==================================================

async function deleteEvent(eventId) {

    const event =
        events.find(
            function(event) {

                return (
                    String(event.id) ===
                    String(eventId)
                );

            }
        );


    if (!event) {

        return;

    }


    const eventCreators =
        creators.filter(
            function(creator) {

                return (
                    String(creator.eventId) ===
                    String(eventId)
                );

            }
        );


    const eventProducts =
        products.filter(
            function(product) {

                return (
                    String(product.eventId) ===
                    String(eventId)
                );

            }
        );


    let message =
        `「${event.name}」を削除しますか？`;


    if (
        eventCreators.length > 0 ||
        eventProducts.length > 0
    ) {

        message +=
            `\n\n制作者：${eventCreators.length}人`;

        message +=
            `\n商品：${eventProducts.length}個`;

        message +=
            "\n\nこれらもすべて削除されます。";

    }


    message +=
        "\n\nこの操作は元に戻せません。";


    if (!confirm(message)) {

        return;

    }


    try {

        // ------------------------------
        // 商品削除
        // ------------------------------

        for (
            const product of eventProducts
        ) {

            await remove(
                ref(
                    db,
                    "products/" +
                    product.id
                )
            );

        }


        // ------------------------------
        // 制作者削除
        // ------------------------------

        for (
            const creator of eventCreators
        ) {

            await remove(
                ref(
                    db,
                    "creators/" +
                    creator.id
                )
            );

        }


        // ------------------------------
        // 文化祭削除
        // ------------------------------

        await remove(
            ref(
                db,
                "events/" +
                eventId
            )
        );


        eventMessage.textContent =
            "🗑️ 文化祭を削除しました。";


        await loadData();


        displayEvents();

        displayEventList();

        displayCreators();

        displayProductCreators();

        displayProducts();


    } catch (error) {

        console.error(
            "文化祭削除エラー:",
            error
        );


        alert(
            "文化祭の削除に失敗しました。"
        );

    }

}


// ==================================================
// 制作者表示
// ==================================================

function displayCreators() {

    const selectedEventId =
        eventSelect.value;


    creatorList.innerHTML = "";


    productCreatorSelect.innerHTML = `
        <option value="">
            先に文化祭を選択してください
        </option>
    `;


    if (!selectedEventId) {

        creatorList.innerHTML = `
            <p>
                開催イベントを選択してください。
            </p>
        `;

        return;

    }


    const eventCreators =
        creators.filter(
            function(creator) {

                return (
                    String(creator.eventId) ===
                    String(selectedEventId)
                );

            }
        );


    if (
        eventCreators.length === 0
    ) {

        creatorList.innerHTML = `
            <p>
                制作者が登録されていません。
            </p>
        `;

        return;

    }


    eventCreators.forEach(
        function(creator) {

            const creatorItem =
                document.createElement(
                    "div"
                );


            creatorItem.className =
                "creator-item";


            const name =
                document.createElement(
                    "span"
                );


            name.textContent =
                "👤 " +
                creator.name;


            const buttonArea =
                document.createElement(
                    "div"
                );


            // ------------------------------
            // 編集
            // ------------------------------

            const editButton =
                document.createElement(
                    "button"
                );


            editButton.textContent =
                "✏️";


            editButton.title =
                "制作者名を編集";


            editButton.addEventListener(
                "click",
                function() {

                    editCreator(
                        creator.id
                    );

                }
            );


            // ------------------------------
            // 削除
            // ------------------------------

            const deleteButton =
                document.createElement(
                    "button"
                );


            deleteButton.textContent =
                "🗑️";


            deleteButton.title =
                "制作者を削除";


            deleteButton.addEventListener(
                "click",
                function() {

                    deleteCreator(
                        creator.id
                    );

                }
            );


            buttonArea.appendChild(
                editButton
            );


            buttonArea.appendChild(
                deleteButton
            );


            creatorItem.appendChild(
                name
            );


            creatorItem.appendChild(
                buttonArea
            );


            creatorList.appendChild(
                creatorItem
            );

        }
    );

}


// ==================================================
// 商品登録用 制作者表示
// ==================================================

function displayProductCreators() {

    const selectedEventId =
        productEventSelect.value;


    productCreatorSelect.innerHTML = `
        <option value="">
            制作者を選択
        </option>
    `;


    if (!selectedEventId) {

        productCreatorSelect.innerHTML = `
            <option value="">
                先に文化祭を選択してください
            </option>
        `;

        return;

    }


    const eventCreators =
        creators.filter(
            function(creator) {

                return (
                    String(creator.eventId) ===
                    String(selectedEventId)
                );

            }
        );


    if (
        eventCreators.length === 0
    ) {

        productCreatorSelect.innerHTML = `
            <option value="">
                制作者が登録されていません
            </option>
        `;

        return;

    }


    eventCreators.forEach(
        function(creator) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                creator.id;


            option.textContent =
                creator.name;


            productCreatorSelect.appendChild(
                option
            );

        }
    );

}


// ==================================================
// 制作者登録
// ==================================================

addCreatorButton.addEventListener(
    "click",
    async function() {

        const eventId =
            eventSelect.value;


        const name =
            creatorInput.value.trim();


        if (!eventId) {

            alert(
                "開催イベントを選択してください。"
            );

            return;

        }


        if (!name) {

            alert(
                "制作者名を入力してください。"
            );

            return;

        }


        const alreadyExists =
            creators.some(
                function(creator) {

                    return (

                        String(
                            creator.eventId
                        ) ===
                        String(eventId)

                        &&

                        creator.name ===
                        name

                    );

                }
            );


        if (alreadyExists) {

            alert(
                "この制作者はすでに登録されています。"
            );

            return;

        }


        const event =
            events.find(
                function(event) {

                    return (
                        String(event.id) ===
                        String(eventId)
                    );

                }
            );


        if (!event) {

            alert(
                "開催イベントが見つかりません。"
            );

            return;

        }


        const confirmed =
            confirm(
                `「${name}」を制作者として登録しますか？\n\n開催イベント：${event.name}`
            );


        if (!confirmed) {

            return;

        }


        try {

            const creatorsRef =
                ref(
                    db,
                    "creators"
                );


            const newCreatorRef =
                push(
                    creatorsRef
                );


            const newCreator = {

                eventId: eventId,

                name: name

            };


            await set(
                newCreatorRef,
                newCreator
            );


            creators.push({

                id: newCreatorRef.key,

                ...newCreator

            });


            creatorInput.value = "";


            creatorMessage.textContent =
                "✅ 制作者を登録しました！";


            displayCreators();

            displayProductCreators();


        } catch (error) {

            console.error(
                "制作者登録エラー:",
                error
            );


            alert(
                "制作者を登録できませんでした。"
            );

        }

    }
);


// ==================================================
// 制作者編集
// ==================================================

async function editCreator(creatorId) {

    const creator =
        creators.find(
            function(creator) {

                return (
                    String(creator.id) ===
                    String(creatorId)
                );

            }
        );


    if (!creator) {

        return;

    }


    const newName =
        prompt(
            "制作者名を入力してください。",
            creator.name
        );


    if (newName === null) {

        return;

    }


    const name =
        newName.trim();


    if (!name) {

        alert(
            "制作者名を入力してください。"
        );

        return;

    }


    try {

        // ------------------------------
        // 制作者名変更
        // ------------------------------

        await update(
            ref(
                db,
                "creators/" +
                creatorId
            ),
            {

                name: name

            }
        );


        // ------------------------------
        // 商品側の制作者名も変更
        // ------------------------------

        const creatorProducts =
            products.filter(
                function(product) {

                    return (
                        String(
                            product.creatorId
                        ) ===
                        String(creatorId)
                    );

                }
            );


        for (
            const product of creatorProducts
        ) {

            await update(
                ref(
                    db,
                    "products/" +
                    product.id
                ),
                {

                    creatorName: name

                }
            );

        }


        creatorMessage.textContent =
            "✅ 制作者名を変更しました！";


        await loadData();


        displayCreators();

        displayProductCreators();

        displayProducts();


    } catch (error) {

        console.error(
            "制作者編集エラー:",
            error
        );


        alert(
            "制作者の編集に失敗しました。"
        );

    }

}


// ==================================================
// 制作者削除
// ==================================================

async function deleteCreator(creatorId) {

    const creator =
        creators.find(
            function(creator) {

                return (
                    String(creator.id) ===
                    String(creatorId)
                );

            }
        );


    if (!creator) {

        return;

    }


    const creatorProducts =
        products.filter(
            function(product) {

                return (
                    String(
                        product.creatorId
                    ) ===
                    String(creatorId)
                );

            }
        );


    let message =
        `「${creator.name}」を削除しますか？`;


    if (
        creatorProducts.length > 0
    ) {

        message +=
            `\n\n商品：${creatorProducts.length}個`;

        message +=
            "\n\nこの商品もすべて削除されます。";

    }


    if (!confirm(message)) {

        return;

    }


    try {

        // ------------------------------
        // 商品削除
        // ------------------------------

        for (
            const product of creatorProducts
        ) {

            await remove(
                ref(
                    db,
                    "products/" +
                    product.id
                )
            );

        }


        // ------------------------------
        // 制作者削除
        // ------------------------------

        await remove(
            ref(
                db,
                "creators/" +
                creatorId
            )
        );


        creatorMessage.textContent =
            "🗑️ 制作者を削除しました。";


        await loadData();


        displayCreators();

        displayProductCreators();

        displayProducts();


    } catch (error) {

        console.error(
            "制作者削除エラー:",
            error
        );


        alert(
            "制作者の削除に失敗しました。"
        );

    }

}


// ==================================================
// 商品表示
// ==================================================

function displayProducts() {

    const selectedEventId =
        eventSelect.value;


    productList.innerHTML = "";


    if (!selectedEventId) {

        productList.innerHTML = `
            <p>
                開催イベントを選択してください。
            </p>
        `;

        return;

    }


    const eventProducts =
        products.filter(
            function(product) {

                return (
                    String(product.eventId) ===
                    String(selectedEventId)
                );

            }
        );


    if (
        eventProducts.length === 0
    ) {

        productList.innerHTML = `
            <p>
                この文化祭には商品が登録されていません。
            </p>
        `;

        return;

    }


    const creatorNames = [];


    eventProducts.forEach(
        function(product) {

            if (
                !creatorNames.includes(
                    product.creatorName
                )
            ) {

                creatorNames.push(
                    product.creatorName
                );

            }

        }
    );


    creatorNames.forEach(
        function(creatorName) {

            const creatorBox =
                document.createElement(
                    "div"
                );


            creatorBox.className =
                "creator-product-box";


            const creatorTitle =
                document.createElement(
                    "h4"
                );


            creatorTitle.textContent =
                "👤 " +
                creatorName;


            creatorBox.appendChild(
                creatorTitle
            );


            eventProducts.forEach(
                function(product) {

                    if (
                        product.creatorName !==
                        creatorName
                    ) {

                        return;

                    }


                    const productItem =
                        document.createElement(
                            "div"
                        );


                    productItem.className =
                        "product-item";


                    const productInfo =
                        document.createElement(
                            "span"
                        );


                    productInfo.innerHTML =
                        `
                        🛍️ ${product.productName}
                       　<strong>
                            ￥${Number(
                                product.price
                            ).toLocaleString()}
                        </strong>
                        `;


                    const buttonArea =
                        document.createElement(
                            "div"
                        );


                    // ------------------------------
                    // 編集
                    // ------------------------------

                    const editButton =
                        document.createElement(
                            "button"
                        );


                    editButton.textContent =
                        "✏️";


                    editButton.title =
                        "商品を編集";


                    editButton.addEventListener(
                        "click",
                        function() {

                            editProduct(
                                product.id
                            );

                        }
                    );


                    // ------------------------------
                    // 削除
                    // ------------------------------

                    const deleteButton =
                        document.createElement(
                            "button"
                        );


                    deleteButton.textContent =
                        "🗑️";


                    deleteButton.title =
                        "商品を削除";


                    deleteButton.addEventListener(
                        "click",
                        function() {

                            deleteProduct(
                                product.id
                            );

                        }
                    );


                    buttonArea.appendChild(
                        editButton
                    );


                    buttonArea.appendChild(
                        deleteButton
                    );


                    productItem.appendChild(
                        productInfo
                    );


                    productItem.appendChild(
                        buttonArea
                    );


                    creatorBox.appendChild(
                        productItem
                    );

                }
            );


            productList.appendChild(
                creatorBox
            );

        }
    );

}


// ==================================================
// 商品登録
// ==================================================

addProductButton.addEventListener(
    "click",
    async function() {

        // ------------------------------
        // 文化祭
        // ------------------------------

        const eventId =
            productEventSelect.value;


        // ------------------------------
        // 制作者
        // ------------------------------

        const creatorId =
            productCreatorSelect.value;


        // ------------------------------
        // 商品名
        // ------------------------------

        const productName =
            productInput.value.trim();


        // ------------------------------
        // 単価
        // ------------------------------

        const price =
            Number(
                priceInput.value
            );


        // ==================================================
        // 入力チェック
        // ==================================================

        if (!eventId) {

            alert(
                "文化祭を選択してください。"
            );

            return;

        }


        if (!creatorId) {

            alert(
                "制作者を選択してください。"
            );

            return;

        }


        if (!productName) {

            alert(
                "商品名を入力してください。"
            );

            return;

        }


        if (
            !Number.isFinite(price) ||
            price < 0
        ) {

            alert(
                "単価を正しく入力してください。"
            );

            return;

        }


        // ==================================================
        // 制作者を探す
        // ==================================================

        const creator =
            creators.find(
                function(creator) {

                    return (
                        String(
                            creator.id
                        ) ===
                        String(creatorId)
                    );

                }
            );


        if (!creator) {

            alert(
                "制作者が見つかりません。"
            );

            return;

        }


        // ==================================================
        // 商品重複チェック
        // ==================================================

        const alreadyExists =
            products.some(
                function(product) {

                    return (

                        String(
                            product.eventId
                        ) ===
                        String(eventId)

                        &&

                        String(
                            product.creatorId
                        ) ===
                        String(creatorId)

                        &&

                        product.productName ===
                        productName

                    );

                }
            );


        if (alreadyExists) {

            alert(
                "同じ制作者の商品がすでに登録されています。"
            );

            return;

        }


        // ==================================================
        // Firebase登録
        // ==================================================

        try {

            const productsRef =
                ref(
                    db,
                    "products"
                );


            const newProductRef =
                push(
                    productsRef
                );


            const newProduct = {

                eventId: eventId,

                creatorId: creatorId,

                creatorName: creator.name,

                productName: productName,

                price: price

            };


            await set(
                newProductRef,
                newProduct
            );


            // ------------------------------
            // 画面側にも追加
            // ------------------------------

            products.push({

                id: newProductRef.key,

                ...newProduct

            });


            // ------------------------------
            // 入力欄クリア
            // ------------------------------

            productInput.value = "";

            priceInput.value = "";


            productMessage.textContent =
                "✅ 商品を登録しました！";


            // ------------------------------
            // 商品一覧更新
            // ------------------------------

            displayProducts();


            console.log(
                "商品登録成功:",
                newProductRef.key
            );


        } catch (error) {

            console.error(
                "商品登録エラー:",
                error
            );


            alert(
                "商品を登録できませんでした。"
            );

        }

    }
);


// ==================================================
// 商品編集
// ==================================================

async function editProduct(productId) {

    const product =
        products.find(
            function(product) {

                return (
                    String(product.id) ===
                    String(productId)
                );

            }
        );


    if (!product) {

        return;

    }


    const newProductName =
        prompt(
            "商品名を入力してください。",
            product.productName
        );


    if (
        newProductName === null
    ) {

        return;

    }


    const productName =
        newProductName.trim();


    if (!productName) {

        alert(
            "商品名を入力してください。"
        );

        return;

    }


    const newPrice =
        prompt(
            "単価を入力してください。",
            product.price
        );


    if (
        newPrice === null
    ) {

        return;

    }


    const price =
        Number(newPrice);


    if (
        !Number.isFinite(price) ||
        price < 0
    ) {

        alert(
            "正しい単価を入力してください。"
        );

        return;

    }


    try {

        await update(
            ref(
                db,
                "products/" +
                productId
            ),
            {

                productName:
                    productName,

                price:
                    price

            }
        );


        productMessage.textContent =
            "✅ 商品を編集しました！";


        await loadData();


        displayProducts();


    } catch (error) {

        console.error(
            "商品編集エラー:",
            error
        );


        alert(
            "商品の編集に失敗しました。"
        );

    }

}


// ==================================================
// 商品削除
// ==================================================

async function deleteProduct(productId) {

    const product =
        products.find(
            function(product) {

                return (
                    String(product.id) ===
                    String(productId)
                );

            }
        );


    if (!product) {

        return;

    }


    if (
        !confirm(
            `「${product.productName}」を削除しますか？`
        )
    ) {

        return;

    }


    try {

        await remove(
            ref(
                db,
                "products/" +
                productId
            )
        );


        productMessage.textContent =
            "🗑️ 商品を削除しました！";


        await loadData();


        displayProducts();


    } catch (error) {

        console.error(
            "商品削除エラー:",
            error
        );


        alert(
            "商品の削除に失敗しました。"
        );

    }

}


// ==================================================
// 制作者管理用の文化祭変更
// ==================================================

eventSelect.addEventListener(
    "change",
    function() {

        creatorMessage.textContent =
            "";

        productMessage.textContent =
            "";

        displayCreators();

        displayProducts();

    }
);


// ==================================================
// 商品登録用の文化祭変更
// ==================================================

productEventSelect.addEventListener(
    "change",
    function() {

        productMessage.textContent =
            "";

        displayProductCreators();

    }
);


// ==================================================
// 初期化
// ==================================================

async function initialize() {

    try {

        console.log(
            "初期化開始"
        );


        // ------------------------------
        // Firebaseログイン
        // ------------------------------

        await login();


        // ------------------------------
        // Firebaseから読み込み
        // ------------------------------

        await loadData();


        // ------------------------------
        // 文化祭表示
        // ------------------------------

        displayEvents();


        displayEventList();


        // ------------------------------
        // 制作者・商品表示
        // ------------------------------

        displayCreators();


        displayProductCreators();


        displayProducts();


        console.log(
            "初期化完了"
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