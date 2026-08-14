// ==================================================
// 文化祭 売上明細
// Firebase Realtime Database版
// ==================================================

import {
    db,
    auth
} from "./firebase.js";

import {
    ref,
    get,
    push,
    set,
    remove
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-database.js";

import {
    signInAnonymously
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";


// ==================================================
// データ
// ==================================================

let events = [];
let sales = [];


// ==================================================
// HTML要素
// ==================================================

const eventSelect =
    document.getElementById("eventSelect");

const salesContainer =
    document.getElementById("salesContainer");

const day1Total =
    document.getElementById("day1Total");

const day2Total =
    document.getElementById("day2Total");

const allTotal =
    document.getElementById("allTotal");

const dayFilter =
    document.getElementById("dayFilter");

const creatorFilter =
    document.getElementById("creatorFilter");

const productFilter =
    document.getElementById("productFilter");


// ==================================================
// 削除モーダル
// ==================================================

const deleteModal =
    document.getElementById("deleteModal");

const confirmDeleteButton =
    document.getElementById("confirmDeleteButton");

const cancelDeleteButton =
    document.getElementById("cancelDeleteButton");

let deleteTargetId = null;


// ==================================================
// 編集モーダル
// ==================================================

const editModal =
    document.getElementById("editModal");

const editProductName =
    document.getElementById("editProductName");

const editQuantity =
    document.getElementById("editQuantity");

const editUnitPrice =
    document.getElementById("editUnitPrice");

const confirmEditButton =
    document.getElementById("confirmEditButton");

const cancelEditButton =
    document.getElementById("cancelEditButton");

let editTargetId = null;


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
// Firebaseからイベントを読み込む
// ==================================================

async function loadEvents() {

    const eventsRef =
        ref(db, "events");

    const snapshot =
        await get(eventsRef);

    const data =
        snapshot.val();

    if (!data) {

        events = [];

        return;

    }

    events =
        Object.entries(data).map(
            function([id, event]) {

                return {
                    id: id,
                    ...event
                };

            }
        );

}


// ==================================================
// Firebaseから売上を読み込む
// ==================================================

async function loadSales() {

    const salesRef =
        ref(db, "sales");

    const snapshot =
        await get(salesRef);

    const data =
        snapshot.val();

    if (!data) {

        sales = [];

        return;

    }

    sales =
        Object.entries(data).map(
            function([id, sale]) {

                return {
                    id: id,
                    ...sale
                };

            }
        );

}


// ==================================================
// イベント表示
// ==================================================

function displayEvents() {

    eventSelect.innerHTML = "";

    const defaultOption =
        document.createElement("option");

    defaultOption.value = "";

    defaultOption.textContent =
        "開催イベントを選択";

    eventSelect.appendChild(
        defaultOption
    );


    events.forEach(
        function(event) {

            const option =
                document.createElement("option");

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
// フィルター設定
// ==================================================

function setupFilters() {

    const selectedEventId =
        String(eventSelect.value);


    creatorFilter.innerHTML =
        `<option value="all">全員</option>`;

    productFilter.innerHTML =
        `<option value="all">すべて</option>`;


    if (!selectedEventId) {

        return;

    }


    const eventSales =
        sales.filter(
            function(sale) {

                return String(
                    sale.eventId
                ) ===
                selectedEventId;

            }
        );


    // ==================================================
    // 制作者
    // ==================================================

    const creators = [];


    eventSales.forEach(
        function(sale) {

            if (
                sale.creatorName &&
                !creators.includes(
                    sale.creatorName
                )
            ) {

                creators.push(
                    sale.creatorName
                );

            }

        }
    );


    creators.forEach(
        function(creator) {

            const option =
                document.createElement("option");

            option.value =
                creator;

            option.textContent =
                creator;

            creatorFilter.appendChild(
                option
            );

        }
    );


    updateProductFilter(
        eventSales
    );

}


// ==================================================
// 商品フィルター更新
// ==================================================

function updateProductFilter(
    eventSales
) {

    const selectedCreator =
        creatorFilter.value;


    let filteredSales =
        eventSales;


    if (
        selectedCreator &&
        selectedCreator !== "all"
    ) {

        filteredSales =
            eventSales.filter(
                function(sale) {

                    return (
                        sale.creatorName ===
                        selectedCreator
                    );

                }
            );

    }


    const products = [];


    filteredSales.forEach(
        function(sale) {

            if (
                sale.productName &&
                !products.includes(
                    sale.productName
                )
            ) {

                products.push(
                    sale.productName
                );

            }

        }
    );


    productFilter.innerHTML =
        `<option value="all">すべて</option>`;


    products.forEach(
        function(product) {

            const option =
                document.createElement("option");

            option.value =
                product;

            option.textContent =
                product;

            productFilter.appendChild(
                option
            );

        }
    );

}


// ==================================================
// 絞り込み後の売上
// ==================================================

function getFilteredSales() {

    const selectedEventId =
        String(eventSelect.value);


    if (!selectedEventId) {

        return [];

    }


    return sales.filter(
        function(sale) {

            // --------------------------
            // 文化祭
            // --------------------------

            if (
                String(sale.eventId) !==
                selectedEventId
            ) {

                return false;

            }


            // --------------------------
            // 開催日
            // --------------------------

            if (
                dayFilter.value !== "all" &&
                Number(sale.day) !==
                Number(dayFilter.value)
            ) {

                return false;

            }


            // --------------------------
            // 制作者
            // --------------------------

            if (
                creatorFilter.value !== "all" &&
                sale.creatorName !==
                creatorFilter.value
            ) {

                return false;

            }


            // --------------------------
            // 商品
            // --------------------------

            if (
                productFilter.value !== "all" &&
                sale.productName !==
                productFilter.value
            ) {

                return false;

            }


            return true;

        }
    );

}


// ==================================================
// 売上明細表示
// ==================================================

function displaySales() {

    const selectedEventId =
        eventSelect.value;


    if (!selectedEventId) {

        salesContainer.innerHTML =
            "<p>開催イベントを選択してください。</p>";

        return;

    }


    const eventSales =
        getFilteredSales();


    salesContainer.innerHTML =
        "";


    if (
        eventSales.length === 0
    ) {

        salesContainer.innerHTML =
            "<p>条件に一致する売上データがありません。</p>";

        return;

    }


    // ==================================================
    // 制作者ごとにまとめる
    // ==================================================

    const creators = {};


    eventSales.forEach(
        function(sale) {

            const creatorName =
                sale.creatorName ||
                "制作者未設定";


            if (
                !creators[creatorName]
            ) {

                creators[creatorName] = {

                    name:
                        creatorName,

                    sales: []

                };

            }


            creators[
                creatorName
            ].sales.push(
                sale
            );

        }
    );


    // ==================================================
    // 制作者ごとに表示
    // ==================================================

    Object.values(
        creators
    ).forEach(
        function(creator) {

            const article =
                document.createElement(
                    "article"
                );

            article.className =
                "creator-group";


            // --------------------------
            // 制作者名
            // --------------------------

            const title =
                document.createElement(
                    "h3"
                );

            title.textContent =
                "👤 " +
                creator.name;

            article.appendChild(
                title
            );


            // --------------------------
            // テーブル
            // --------------------------

            const table =
                document.createElement(
                    "table"
                );

            table.className =
                "sales-table";


            table.innerHTML = `
                <thead>
                    <tr>
                        <th>商品名</th>
                        <th>個数</th>
                        <th>単価</th>
                        <th>売上</th>
                        <th>操作</th>
                    </tr>
                </thead>
            `;


            const tbody =
                document.createElement(
                    "tbody"
                );


            let creatorTotal = 0;


            creator.sales.forEach(
                function(sale) {

                    creatorTotal +=
                        Number(
                            sale.total
                        );


                    const row =
                        document.createElement(
                            "tr"
                        );


                    row.innerHTML = `

                        <td>
                            ${sale.productName}
                        </td>

                        <td>
                            ${sale.quantity}個
                        </td>

                        <td>
                            ￥${Number(
                                sale.unitPrice
                            ).toLocaleString()}
                        </td>

                        <td>
                            ￥${Number(
                                sale.total
                            ).toLocaleString()}
                        </td>

                        <td>

                            <button
                                class="edit-btn"
                                data-id="${sale.id}"
                            >
                                ✏️
                            </button>

                            <button
                                class="delete-btn"
                                data-id="${sale.id}"
                            >
                                🗑️
                            </button>

                        </td>

                    `;


                    tbody.appendChild(
                        row
                    );

                }
            );


            table.appendChild(
                tbody
            );


            article.appendChild(
                table
            );


            // --------------------------
            // 制作者合計
            // --------------------------

            const total =
                document.createElement(
                    "p"
                );

            total.className =
                "creator-total";

            total.textContent =
                creator.name +
                " 合計　￥" +
                creatorTotal.toLocaleString();


            article.appendChild(
                total
            );


            salesContainer.appendChild(
                article
            );

        }
    );

}


// ==================================================
// 売上まとめ
// ==================================================

function displaySummary() {

    const selectedEventId =
        eventSelect.value;


    if (!selectedEventId) {

        day1Total.textContent =
            "￥0";

        day2Total.textContent =
            "￥0";

        allTotal.textContent =
            "￥0";

        return;

    }


    // ★ まとめはフィルターを無視して
    // 文化祭全体の売上を表示する

    const eventSales =
        sales.filter(
            function(sale) {

                return String(
                    sale.eventId
                ) ===
                String(
                    selectedEventId
                );

            }
        );


    let day1 = 0;

    let day2 = 0;


    eventSales.forEach(
        function(sale) {

            if (
                Number(sale.day) === 1
            ) {

                day1 +=
                    Number(sale.total);

            }


            if (
                Number(sale.day) === 2
            ) {

                day2 +=
                    Number(sale.total);

            }

        }
    );


    const total =
        day1 + day2;


    day1Total.textContent =
        "￥" +
        day1.toLocaleString();


    day2Total.textContent =
        "￥" +
        day2.toLocaleString();


    allTotal.textContent =
        "￥" +
        total.toLocaleString();

}


// ==================================================
// 削除・編集ボタン
// ==================================================

salesContainer.addEventListener(
    "click",
    function(e) {

        // ==================================================
        // 削除
        // ==================================================

        const deleteButton =
            e.target.closest(
                ".delete-btn"
            );


        if (deleteButton) {

            deleteTargetId =
                String(
                    deleteButton.dataset.id
                );


            deleteModal.classList.remove(
                "hidden"
            );


            return;

        }


        // ==================================================
        // 編集
        // ==================================================

        const editButton =
            e.target.closest(
                ".edit-btn"
            );


        if (editButton) {

            editTargetId =
                String(
                    editButton.dataset.id
                );


            const sale =
                sales.find(
                    function(item) {

                        return String(
                            item.id
                        ) ===
                        editTargetId;

                    }
                );


            if (!sale) {

                alert(
                    "売上データが見つかりません。"
                );

                return;

            }


            editProductName.value =
                sale.productName || "";

            editQuantity.value =
                sale.quantity || 1;

            editUnitPrice.value =
                sale.unitPrice || 0;


            editModal.classList.remove(
                "hidden"
            );

        }

    }
);


// ==================================================
// 削除確定
// ==================================================

confirmDeleteButton.addEventListener(
    "click",
    async function(e) {

        e.preventDefault();


        if (
            deleteTargetId === null
        ) {

            return;

        }


        confirmDeleteButton.disabled =
            true;


        try {

            // Firebaseのsales内の対象データを削除

            const saleRef =
                ref(
                    db,
                    "sales/" +
                    deleteTargetId
                );


            await remove(
                saleRef
            );


            console.log(
                "売上削除成功:",
                deleteTargetId
            );


            // ローカルの配列からも削除

            sales =
                sales.filter(
                    function(sale) {

                        return String(
                            sale.id
                        ) !==
                        String(
                            deleteTargetId
                        );

                    }
                );


            deleteTargetId =
                null;


            deleteModal.classList.add(
                "hidden"
            );


            setupFilters();

            displaySales();

            displaySummary();


        } catch (error) {

            console.error(
                "売上削除エラー:",
                error
            );


            alert(
                "売上を削除できませんでした。"
            );

        } finally {

            confirmDeleteButton.disabled =
                false;

        }

    }
);


// ==================================================
// 削除キャンセル
// ==================================================

cancelDeleteButton.addEventListener(
    "click",
    function() {

        deleteTargetId =
            null;

        deleteModal.classList.add(
            "hidden"
        );

    }
);


// ==================================================
// 編集確定
// ==================================================

confirmEditButton.addEventListener(
    "click",
    async function() {

        if (
            editTargetId === null
        ) {

            return;

        }


        const productName =
            editProductName.value.trim();

        const quantity =
            Number(
                editQuantity.value
            );

        const unitPrice =
            Number(
                editUnitPrice.value
            );


        // ==================================================
        // 入力チェック
        // ==================================================

        if (!productName) {

            alert(
                "商品名を入力してください。"
            );

            return;

        }


        if (
            !Number.isInteger(quantity) ||
            quantity <= 0
        ) {

            alert(
                "個数は1個以上の整数で入力してください。"
            );

            return;

        }


        if (
            !Number.isFinite(unitPrice) ||
            unitPrice < 0
        ) {

            alert(
                "単価を正しく入力してください。"
            );

            return;

        }


        // ==================================================
        // 対象売上を取得
        // ==================================================

        const sale =
            sales.find(
                function(item) {

                    return String(
                        item.id
                    ) ===
                    String(
                        editTargetId
                    );

                }
            );


        if (!sale) {

            alert(
                "売上データが見つかりません。"
            );

            return;

        }


        const total =
            quantity *
            unitPrice;


        // ==================================================
        // 編集後データ
        // ==================================================

        const updatedSale = {

            ...sale,

            productName:
                productName,

            quantity:
                quantity,

            unitPrice:
                unitPrice,

            total:
                total

        };


        confirmEditButton.disabled =
            true;

        confirmEditButton.textContent =
            "保存中...";


        try {

            // ==================================================
            // Firebase更新
            // ==================================================

            const saleRef =
                ref(
                    db,
                    "sales/" +
                    editTargetId
                );


            await set(
                saleRef,
                updatedSale
            );


            console.log(
                "売上編集成功:",
                editTargetId
            );


            // ==================================================
            // 配列も更新
            // ==================================================

            sales =
                sales.map(
                    function(item) {

                        if (
                            String(item.id) ===
                            String(editTargetId)
                        ) {

                            return {
                                id:
                                    editTargetId,
                                ...updatedSale
                            };

                        }


                        return item;

                    }
                );


            editTargetId =
                null;


            editModal.classList.add(
                "hidden"
            );


            setupFilters();

            displaySales();

            displaySummary();


        } catch (error) {

            console.error(
                "売上編集エラー:",
                error
            );


            alert(
                "売上を編集できませんでした。"
            );

        } finally {

            confirmEditButton.disabled =
                false;

            confirmEditButton.textContent =
                "保存する";

        }

    }
);


// ==================================================
// 編集キャンセル
// ==================================================

cancelEditButton.addEventListener(
    "click",
    function() {

        editTargetId =
            null;

        editModal.classList.add(
            "hidden"
        );

    }
);


// ==================================================
// イベント変更
// ==================================================

eventSelect.addEventListener(
    "change",
    function() {

        const selectedEventId =
            eventSelect.value;


        localStorage.setItem(
            "selectedEventId",
            selectedEventId
        );


        dayFilter.value =
            "all";

        creatorFilter.value =
            "all";

        productFilter.value =
            "all";


        setupFilters();

        displaySales();

        displaySummary();

    }
);


// ==================================================
// 開催日フィルター
// ==================================================

dayFilter.addEventListener(
    "change",
    function() {

        displaySales();

        displaySummary();

    }
);


// ==================================================
// 制作者フィルター
// ==================================================

creatorFilter.addEventListener(
    "change",
    function() {

        const selectedEventId =
            String(
                eventSelect.value
            );


        const eventSales =
            sales.filter(
                function(sale) {

                    return String(
                        sale.eventId
                    ) ===
                    selectedEventId;

                }
            );


        updateProductFilter(
            eventSales
        );


        productFilter.value =
            "all";


        displaySales();

        displaySummary();

    }
);


// ==================================================
// 商品フィルター
// ==================================================

productFilter.addEventListener(
    "change",
    function() {

        displaySales();

        displaySummary();

    }
);


// ==================================================
// 初期化
// ==================================================

async function initialize() {

    try {

        // --------------------------
        // Firebaseログイン
        // --------------------------

        await login();


        // --------------------------
        // Firebaseデータ読み込み
        // --------------------------

        await loadEvents();

        await loadSales();


        console.log(
            "events:",
            events
        );

        console.log(
            "sales:",
            sales
        );


        // --------------------------
        // イベント表示
        // --------------------------

        displayEvents();


        // --------------------------
        // 前回選択したイベント
        // --------------------------

        const savedEventId =
            localStorage.getItem(
                "selectedEventId"
            );


        if (
            savedEventId &&
            events.some(
                function(event) {

                    return String(
                        event.id
                    ) ===
                    String(
                        savedEventId
                    );

                }
            )
        ) {

            eventSelect.value =
                savedEventId;

        }


        // --------------------------
        // 初期表示
        // --------------------------

        if (
            eventSelect.value
        ) {

            setupFilters();

            displaySales();

            displaySummary();

        } else {

            salesContainer.innerHTML =
                "<p>開催イベントを選択してください。</p>";

            day1Total.textContent =
                "￥0";

            day2Total.textContent =
                "￥0";

            allTotal.textContent =
                "￥0";

        }


        console.log(
            "売上明細ページ初期化完了"
        );


    } catch (error) {

        console.error(
            "初期化エラー:",
            error
        );


        salesContainer.innerHTML =
            "<p>Firebaseからデータを読み込めませんでした。</p>";

    }

}


// ==================================================
// 開始
// ==================================================

initialize();