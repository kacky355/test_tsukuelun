from dataclasses import asdict
import json
from flask import Flask, redirect, render_template, request, url_for
from glob import glob
import pandas as pd
import random
import re
from question_maker import QuestionMaker,QuestionList
app = Flask(__name__)

# 一問一答用csvファイルの読み込み
csvs = glob('./static/csv/*.csv')
df_questions = pd.DataFrame()
for csv in csvs:
    df_questions = pd.concat([df_questions,pd.read_csv(csv,index_col=0)])
df_questions.reset_index(drop=True,inplace=True)
question_size = df_questions.shape[0]

# 問題作るクラスのインスタンス化
q_maker = QuestionMaker()


# ホームページ
@app.route('/')
def index():
    title = 'home'
    return render_template('index.html',title=title)

# 一問一答用ページ　ランダムで問題を選択して表示
@app.route('/question')
def question():
    title = '一問一答'
    id = random.randint(0,question_size-1)
    question = q_maker.make_question(df_questions,id)
    
    return render_template('question.html',title=title,question=question)

# 模試ページ　choose_examで選んだcsvファイルをtimelimit_min分で全問出題
@app.route('/exam/<int:exam_id>')
def exam(exam_id):
    exam_id = int(exam_id)
    exam = pd.read_csv(f'static/csv/gmoshi{exam_id}.csv',index_col=0)
    time_limit_minutes = 120
    qusetions_list =q_maker.make_questions_list(exam)
    qusetions_list = json.dumps(asdict(qusetions_list))
    title = "模擬試験"
    
    return render_template('exam.html',questions_list=qusetions_list, time_limit_minutes=time_limit_minutes ,title=title)

@app.route('/choose_exam')
def choose_exam():
    print(csvs)
    title = '試験選択'
    exams = [re.split(r'[\\/]',x)[-1].split('.csv')[0] for x in csvs]
    return render_template('choose_exam.html',exams=exams,title=title)

@app.route('/exam_result/', methods=['POST'])
def exam_result():
    title = '解答解説'
    q_list = request.form.get('answer_data')
    q_list = json.loads(q_list)
    q_list= json.dumps(q_list)
    return render_template('exam_result.html',questions_list=q_list,title=title)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)