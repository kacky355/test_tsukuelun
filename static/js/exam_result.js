{
let q_list = JSON.parse(question_list);
const last_question = q_list.list_size -1;
let q_place = document.getElementById('question_place_holder');
let answer_list = q_list.ans_list;
let check_list = q_list.like_list;

function getQuestion(q_list,id){
    let question = q_list.questions_list[id];
    return question;
}

//# 見直しマークのオンオフ
function setCheck(){
    let check_btn = document.getElementById("check_btn");
    check_list[current_id] = 1;
    check_btn.innerHTML = `<i class="fa-solid fa-star fa-2x unlikeBtn" onclick=setUnCheck() style="theme-colors:warning" ></i>`;
}

//#
function setUnCheck(){
    let check_btn = document.getElementById("check_btn");
    check_list[current_id] = 0;
    check_btn.innerHTML = `<i class="fa-regular fa-star my-gray fa-2x" onclick=setCheck()></i>`;
}


// #問題の内容作成
function makeQuestionExplanation(question){
    const q_text = question.q_text;
    const q_number = question.q_number;
    const opts = question.opts;
    const ans = question.ans;
    const explanation = question.explanation;
    const your_answer = answer_list[question.q_id];


    option_html=makeAnsweredOptions(opts,ans,your_answer);

    question_html=`<div class = "row">
    <div class="d-grid gap-2">
        <div class = "row">
            <div class="col">
                <p class="fs-5 text-body-secondary">問題${q_number}</p>
            </div>
            <div class="col gap-5 offset-md-6 d-flex align-items-center justify-content-around" id="check_btn">
                <i class="fa-regular fa-star my-gray fa-2x" onclick=setCheck()></i>
            </div>
        </div>
        <p class="fs-5 text-body-secondary">${q_text}</p>

        <div id="liveAlertPlaceholder"></div>
        
        <div class="row gap-1 justify-content-evenly">
        ${option_html}
        </div>
        <div class="row gap-2">
            <p class="fs-5 text-body-secondary">${explanation}</p>
        </div>

    </div>
</div>
<!-- 問題の移動ボタン-->
<div class="container">
    <div class="row gap-4 mt-4">
        <div class = "col d-flex align-items-center justify-content-center">
            <button type="button" class = "btn btn-outline-secondary" onclick = beforeQuestion(current_id) id="before_question_btn">前の問題</button>
        </div>
        <div class="col d-flex align-items-center justify-content-center">
            <!-- 前後の問題番号並べるやつ-->
            <button class ="btn btn-outline-secondary" onclick = seeQuestionList() id="next_question_btn">すべての問題を確認</button>
        </div>
        <div class = "col d-flex align-items-center justify-content-center">
            <button class ="btn btn-outline-secondary" onclick = nextQuestion(current_id) id="next_question_btn">次の問題</button>
        </div>
    </div>
</div>

`;
    return question_html;
} 

function addQuestion(id){
    current_id = id;
    let question = getQuestion(q_list,id);
    q_place.innerHTML = makeQuestionExplanation(question);
    if(check_list[id] === 1){
        setCheck();
    }
    return current_id;

}


function makeAnsweredOptions(opts,ans,your_answer){

    let option_html = "";
    const is_correct = ans==your_answer;

    option_html+=correctChecker(is_correct);
    for(i = 1; i<=opts.length; i++){
        option_html += `<button class="btn ${ans === i?"checked btn-success": your_answer === i?"checked btn-danger" :"btn-primary"}" type="button" id="optBtn${i}">${opts[i-1]}</button>
        `;

    }

    return option_html;
}

function correctChecker(correct){
    let message;
    let type;
    if(correct){
        message='正解';
        type='success';
    }else{
        message='不正解';
        type='danger';
    }

    const alertHtml =`
    <div class="alert alert-${type} alert-dismissible" role="alert">
    <div>${message}</div>
    </div>
    `

    return alertHtml;
}

// #ボタン類
// #次の問題ボタン
function nextQuestion(current_id){
    if(current_id === last_question){
        return seeQuestionList();
    }

    let next_id =current_id +1;

    return addQuestion(next_id);
}

// #前の問題ボタン
function beforeQuestion(current_id){
    if(current_id === 0){
        return seeQuestionList();
    }

    let before_id = current_id -1;

    return addQuestion(before_id);
}

// #全問表示周り
//# 解答状態の設定
function setResultState(q_id){
    let question_state;
    let btn_state;
    const question_number = i +1;
    const ans = getQuestion(q_list,q_id).ans

    
    if(answer_list[q_id] === ans){
        question_state = '正　解';
        btn_state = 'btn-primary';
    }else{
        question_state = '不正解';
        btn_state = 'btn-danger';
    }

    if(check_list[q_id] === 1){
        btn_state = 'btn-warning'
    }

    let question_card = `<div class="col mt-1">
    <button type="button" class="btn ${btn_state} d-flex align-items-center justify-content-center" onclick=addQuestion(${i})>問題${question_number}<br>  [[${question_state}]]  </button>
    </div>
    `;

    return question_card;

}

// 全問表示画面の作成
function seeQuestionList(){
    let q_list_html=""
    for(i=0;i <q_list.list_size;i++){

        q_list_html += setResultState(i);
    }

    q_place.innerHTML = `<h1>問題リスト確認</h1>
<div class="container">
<div class="row">
    <div class = "col mt-2">
        <button class ="btn btn-primary" onclick = addQuestion(current_id) >元の問題に戻る</button>
    </div>
</div>
<div class="row mt-1 row-cols-3 row-cols-sm-4 row-cols-md-6">
    ${q_list_html}
</div>
</div>
    `;

}
}