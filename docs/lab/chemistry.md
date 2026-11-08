# 化学实验台

从左侧选择**实验器材**或**化学试剂**，拖到右侧实验台。  
对容器可执行：**倾倒 / 混合 / 加热 / 清空**。发生反应时，下方实时显示**化学方程式**与**离子方程式**。

<div id="lab-chem-app" class="lab-app" markdown="0">
  <div class="lab-toolbar">
    <input id="lab-chem-title" class="lab-title-input" type="text" maxlength="40" placeholder="实验名称（可选）" value="未命名化学实验" />
    <button type="button" id="lab-chem-save" class="quiz-btn quiz-btn-next">保存进度</button>
    <button type="button" id="lab-chem-load" class="quiz-btn exam-btn-ghost">读取云端</button>
    <button type="button" id="lab-chem-clear" class="quiz-btn exam-btn-ghost">清空台面</button>
    <span id="lab-chem-msg" class="lab-msg"></span>
  </div>

  <div class="lab-layout">
    <aside class="lab-side">
      <h3>实验物资</h3>
      <div id="lab-chem-cats" class="lab-cats"></div>
      <div id="lab-chem-palette" class="lab-palette"></div>
    </aside>

    <main class="lab-main">
      <div class="lab-bench-wrap">
        <div id="lab-chem-bench" class="lab-bench" data-drop="bench">
          <p class="lab-bench-hint">将器材或试剂拖到此处</p>
        </div>
      </div>

      <div class="lab-ops">
        <label>操作目标
          <select id="lab-chem-target"></select>
        </label>
        <label>来源（倾倒）
          <select id="lab-chem-source"></select>
        </label>
        <button type="button" id="lab-chem-pour" class="quiz-btn quiz-btn-answer">倾倒混合</button>
        <button type="button" id="lab-chem-heat" class="quiz-btn exam-btn-ghost">加热</button>
        <button type="button" id="lab-chem-empty" class="quiz-btn exam-btn-ghost">清空容器</button>
        <button type="button" id="lab-chem-remove" class="quiz-btn exam-btn-ghost">移出台面</button>
      </div>

      <section class="lab-log">
        <h3>反应与现象</h3>
        <div id="lab-chem-eq" class="lab-eq kb-math arithmatex">尚无反应</div>
        <ul id="lab-chem-log" class="lab-log-list"></ul>
      </section>
    </main>
  </div>
</div>
