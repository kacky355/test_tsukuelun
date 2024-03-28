{
let q_list = JSON.parse(question_list);
const last_question = q_list.list_size -1;
let q_place = document.getElementById('question_place_holder');
let answer_list = q_list.ans_list;
let check_list = q_list.like_list;
let due_time;
let interval_timer;
let timeout_timer;

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


// #問題の取得
function getQuestion(q_list,id){
    let question = q_list.questions_list[id];
    return question;
}

//# 一問一答用
function makeOptionHasAnswer(opts,ans){
    let option_html = "";
    for(i = 0; i<opts.length; i++){
        if(i == ans-1){
            option_html += `<button class="btn btn-primary" type="button" id="correctAnswerBtn">${opts[i]}</button>
            `;
        }else{
            option_html +=`<button class="btn btn-primary" type="button" id="incorrectAnswerBtn${i}">${opts[i]}</button>
            `;
        }
    }

    return option_html;

}

// #模試用
function makeOptionNoAnswer(opts){
    let option_html = "";
    for(i = 1; i<=opts.length; i++){
        option_html += `<button class="btn ${answer_list[current_id] === i?"checked btn-success": "btn-primary"}" type="button" onclick = setAnswer(current_id,${i}) id="optBtn${i}">${opts[i-1]}</button>
        `;

    }

    return option_html;

}

// #問題の内容作成
function makeQuestion(question,hasAns){
    let q_text = question.q_text;
    let q_number = question.q_number;
    let opts = question.opts;
    let ans = question.ans;
    let explanation = question.explanation;

    if(hasAns){
        option_html =makeOptionHasAnswer(opts,ans);
    }else{
        option_html = makeOptionNoAnswer(opts)
    }

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
        <p class="fs-5 text-body-secondary" id="explanation">${explanation}</p>

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


<div class ="row">
<div class="col mt-4">
    <button type="button" class="btn btn-danger" onclick=getResult()>試験を終了する</button>
</div>
</div>

`;
    return question_html;
} 

// #画面に問題を表示
function addQuestion(id){
    current_id = id;
    let question = getQuestion(q_list,id);
    q_place.innerHTML = makeQuestion(question,has_answer);
    if(check_list[id] === 1){
        setCheck();
    }
    return current_id;

}

// #解答の登録
function setAnswer(current_id,opt){
    if(answer_list[current_id] != 0){
        let checked = `optBtn${answer_list[current_id]}`
        let checked_option = document.getElementById(checked);
        checked_option.classList.remove('checked','btn-success');
        checked_option.classList.add('btn-primary');
    }
    let selecter =`optBtn${opt}`;
    let selected_option = document.getElementById(selecter);
    selected_option.classList.remove('btn-primary');
    selected_option.classList.add('checked','btn-success');

    answer_list[current_id] = opt;

    return;

}

// #全問表示周り
//# 解答状態の設定
function setAnsweringState(q_id){
    let question_state;
    let btn_state;
    let question_number = i +1;
    
    if(answer_list[q_id] === 0){
        question_state = '未回答';
        btn_state = 'btn-outline-secondary';
    }else{
        question_state = '回答済';
        btn_state = 'btn-primary';
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

        q_list_html += setAnsweringState(i);
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

function checkEnd(){
    q_place.innerHTML = '<h1>終わり</h1>';
}

// #ボタン類
// #次の問題ボタン
function nextQuestion(current_id){
    if(current_id === last_question){
        current_id = 'end';
        return checkEnd();
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

// 結果表示
function getResult(){
    if(checkUnAnswered()){
        let points = checkResult();
        showResults(points);
    }
}

// 未回答問題ありの確認
function checkUnAnswered(){
    let un_answered = 0;
    for(i=0;i<q_list.list_size;i++){
        if(answer_list[i] === 0){
            un_answered++;
        }
    }

    let verify_text ='';
    if(un_answered >0){
        verify_text +=`未回答の問題が${un_answered}問あります。\n`;
    }
    verify_text += `試験を終了しますか？`;
    return confirm(verify_text);
}


// 得点計算
function checkResult(){
    let points = 0;
    for(i=0;i<q_list.list_size;i++){
        let ans = getQuestion(q_list,i).ans;
        if(answer_list[i] === ans){
            points++;
        }
    }

    q_list.ans_list=answer_list;
    q_list.like_list = check_list;

    return points;
}

// 合否判定
function isSuccess(points){
    return is_success = points > q_list.list_size*0.6;
}

// 結果画面の描画
function showResults(points){
    clearInterval(interval_timer);

    let result;
    let result_text;
    if(isSuccess(points)){
        result = '合格';
        result_text=`おめでとうございます！<br>
        あなたは<br>
        全${q_list.list_size}問中、${points}問正解で<br>合格です！！`;
    }else{
        result = '不合格...';
        result_text=`ざんねん...<br>全${q_list.list_size}問中、${points}問正解でした...`;
    }

    result_html=`<div class="row">
        <div class="col">
            <h1>試験結果</h1>
        </div>
    </div>
    <div class="row">
        <div class="col d-flex align-items-center justify-content-center">
            <h1>${result}</h1>
        </div>
    </div>
    <div class="row">
        <div class="col d-flex align-items-center justify-content-center">
            <p>${result_text}</p>
        </div>
    </div>
    <div class="row">
        <div class="col d-flex align-items-center justify-content-center">
            <form id="result_form" action="/exam_result/" method="post">
                <input type="hidden" id="answer_data" name="answer_data">
                <button type="submit" class="btn btn-secondary">
                    解答・解説
                </button>
            </form>
        </div>
    </div>
    `;

    let result_place = document.getElementById('results_place_holder');
    result_place.innerHTML = result_html;
    document.getElementById('result_form').addEventListener('submit',function(event){
        document.getElementById('answer_data').value=JSON.stringify(q_list);
    });
    clearTimeout(timeout_timer);
}

//# 残り時間周り
function setDueTime(time_limit_minutes){
    const today = new Date();
    const due_time = new Date()
    due_time.setMinutes(today.getMinutes() + time_limit_minutes);
    const limit = time_limit_minutes *60 *1000;
    timeout_timer = setTimeout(function(){
        let points = checkResult();
        showResults(points);
        },limit);
    return due_time;
}

//# 残り時間の計算
function countdown(due_time,time_limit_minutes){
    const now = new Date();
    const rest = due_time.getTime() - now.getTime();
    const rest_rate = Math.floor(rest/10/60/time_limit_minutes);
    const sec = Math.floor(rest/1000) % 60;
    const min = Math.floor(rest/1000/60) % 60;
    const hours = Math.floor(rest/1000/60/60) % 24;
    const count = [hours, min, sec,rest_rate];
    return count;
}

//#
function setRestTimebar(due_time){
    const time_bar = document.getElementById('time_bar');
    const rest_time = document.getElementById('rest_time');
    const count = countdown(due_time,time_limit_minutes);
    const hours = count[0] <10 ? "0"+ count[0]  : count[0];
    const minutes = count[1]<10 ? "0"+ count[1]  : count[1];
    const seconds = count[2]<10 ? "0"+ count[2]  : count[2];

    rest_time.innerHTML = `${hours}:${minutes}:${seconds}`;
    time_bar.setAttribute('style',`width: ${count[3]}%`);
}

//#
function start_exam(){
    due_time = setDueTime(time_limit_minutes);

    const time_bar_holder = document.getElementById('time_bar_holder');
    time_bar_holder.innerHTML =`
    <div class="col">
        <p>残り時間: <a id="rest_time">30:35</a></p>
        <div class="progress">
            <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style="width: 0%" id="time_bar"></div>
        </div>
    </div>
`
    interval_timer = setInterval(setRestTimebar,1000,due_time,time_limit_minutes);

    addQuestion(0);
}
}
