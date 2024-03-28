// 正解不正解の表示
const alertPlaceholder = document.getElementById('liveAlertPlaceholder')
const appendAlert = (message, type) => {
  const wrapper = document.createElement('div')
  wrapper.innerHTML = [
    `<div class="alert alert-${type} alert-dismissible" role="alert">`,
    `   <div>${message}</div>`,
    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    '</div>'
  ].join('')

  alertPlaceholder.append(wrapper)
}

// 解説の表示
const explanation = document.getElementById('explanation')
const showExplanation = () => {
    explanation.style.display = "block"; 
}

// 選択肢関連
const correctTrigger = document.getElementById('correctAnswerBtn')
if (correctTrigger) {
  correctTrigger.addEventListener('click', () => {
    appendAlert('正解', 'success');
    showExplanation();
    correctTrigger.setAttribute("disabled", true);
  },)
}
for(let i=0;i<4;i++){
const incorrectTrigger = document.getElementById(`incorrectAnswerBtn${i}`)
if (incorrectTrigger) {
    incorrectTrigger.addEventListener('click', () => {
        appendAlert('不正解', 'danger');
        incorrectTrigger.setAttribute("disabled", true);
    })
    }
}

const optTrigger = document.getElementsByClassName('optBtn');

// 見直しボタン

const likeTrigger = document.getElementsByClassName('likes');
for(i=0;i<likeTrigger.length;i++){
  if(likeTrigger[i]){
    likeTrigger[i].onclick = function(){
      if(likeTrigger[i].querySelector("likeBtn").style.display == "block"){
        likeTrigger[i].querySelector("likeBtn").style.display = "none";
        likeTrigger[i].querySelector("unlikeBtn").style.display = "block";
      }else{
        likeTrigger[i].querySelector("likeBtn").style.display = "block";
        likeTrigger[i].querySelector("unlikeBtn").style.display = "none";
      }
    }
  }
}