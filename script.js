document.addEventListener('DOMContentLoaded', function() {
    // DOM元素
    const questionList = document.getElementById('question-list');
    const levelFilter = document.getElementById('level-filter');
    const typeFilter = document.getElementById('type-filter');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const refreshBtn = document.getElementById('refresh-btn');
    const newQuestionBtn = document.getElementById('new-question-btn');
    const questionEditor = document.getElementById('question-editor');
    const closeBtn = document.querySelector('.close-btn');
    const editorTitle = document.getElementById('editor-title');
    const questionForm = document.getElementById('question-form');
    const pagination = document.getElementById('pagination');

    // 状态变量
    let questions = [];
    let filteredQuestions = [];
    let currentPage = 1;
    const questionsPerPage = 10;
    let currentQuestionId = null;

    // 初始化
        generateForm();
        initImageUpload();
        loadQuestions();

    // 事件监听
    refreshBtn.addEventListener('click', loadQuestions);
    newQuestionBtn.addEventListener('click', () => openEditor());
    closeBtn.addEventListener('click', closeEditor);
    searchBtn.addEventListener('click', filterQuestions);
    searchInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') filterQuestions(); });
    levelFilter.addEventListener('change', filterQuestions);
    typeFilter.addEventListener('change', filterQuestions);
    questionForm.addEventListener('submit', saveQuestion);

    // 加载题目
    function loadQuestions() {
        showStatus('loading', '正在加载题目...');
        // 在实际应用中，这里会通过后端API获取题目数据
        // 这里我们模拟加载本地存储的题目
        setTimeout(() => {
            // 模拟从文件系统加载题目
            // 实际应用中需要后端支持
            questions = [
                {
                    id: '2024_12_01',
                    year: 2024,
                    month: 12,
                    level: 1,
                    type: 'choice',
                    question: '以下哪个是Python中正确的变量命名？',
                    options: [
                        {key: 'A', value: '2name'},
                        {key: 'B', value: 'my_name'},
                        {key: 'C', value: 'my-name'},
                        {key: 'D', value: 'class'}
                    ],
                    answer: 'B',
                    explanation: 'Python变量命名规则：只能包含字母、数字和下划线，不能以数字开头，不能使用关键字。选项B符合规则。',
                    difficulty: 1,
                    tags: ['变量命名', '基础语法']
                },
                {
                    id: '2024_12_02',
                    year: 2024,
                    month: 12,
                    level: 1,
                    type: 'judge',
                    question: 'Python是一种编译型语言。',
                    options: [],
                    answer: 'false',
                    explanation: 'Python是一种解释型语言，不需要编译成机器码即可运行。',
                    difficulty: 1,
                    tags: ['语言特性', '基础概念']
                }
            ];

            filteredQuestions = [...questions];
            renderQuestionList();
            renderPagination();
            showStatus('success', '题目加载成功');
        }, 800);
    }

    // 筛选题目
    function filterQuestions() {
        const level = levelFilter.value;
        const type = typeFilter.value;
        const searchTerm = searchInput.value.toLowerCase();

        filteredQuestions = questions.filter(question => {
            const matchesLevel = level === 'all' || question.level === parseInt(level);
            const matchesType = type === 'all' || question.type === type;
            const matchesSearch = searchTerm === '' || 
                question.question.toLowerCase().includes(searchTerm) || 
                question.explanation.toLowerCase().includes(searchTerm) || 
                question.tags.some(tag => tag.toLowerCase().includes(searchTerm));

            return matchesLevel && matchesType && matchesSearch;
        });

        currentPage = 1;
        renderQuestionList();
        renderPagination();

        if (filteredQuestions.length === 0) {
            showStatus('error', '没有找到匹配的题目');
        } else {
            showStatus('success', `找到 ${filteredQuestions.length} 道题目`);
        }
    }

    // 渲染题目列表
    function renderQuestionList() {
        questionList.innerHTML = '';

        const startIndex = (currentPage - 1) * questionsPerPage;
        const endIndex = startIndex + questionsPerPage;
        const paginatedQuestions = filteredQuestions.slice(startIndex, endIndex);

        if (paginatedQuestions.length === 0) {
            questionList.innerHTML = '<p class="status-message">没有题目可显示</p>';
            return;
        }

        paginatedQuestions.forEach(question => {
            const questionItem = document.createElement('div');
            questionItem.className = 'question-item';
            questionItem.dataset.id = question.id;

            const questionType = question.type === 'choice' ? '选择题' : '判断题';
            const difficultyStars = '★'.repeat(question.difficulty) + '☆'.repeat(5 - question.difficulty);

            // 处理代码块显示
        let codeBlockHTML = '';
        if (question.codeBlock) {
            codeBlockHTML = `
                <div class="question-code-block">
                    <pre><code class="language-${question.codeBlock.language}">${escapeHtml(question.codeBlock.content)}</code></pre>
                </div>
            `;
        }

        // 处理图片显示
        let imagesHTML = '';
        if (question.images && question.images.length > 0) {
            imagesHTML = `
                <div class="question-images">
                    ${question.images.map(imgSrc => `<img src="${imgSrc}" alt="题目图片" class="question-image">`).join('')}
                </div>
            `;
        }

        questionItem.innerHTML = `
                <h3>
                    ${question.question}
                    <span class="question-type">${questionType}</span>
                </h3>
                <div class="question-meta">
                    <span>等级: ${question.level}</span>
                    <span>难度: ${difficultyStars}</span>
                    <span>ID: ${question.id}</span>
                </div>
                ${codeBlockHTML}
                ${imagesHTML}
                <div class="tags">
                    ${question.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            `;

            questionItem.addEventListener('click', () => openEditor(question.id));
            questionList.appendChild(questionItem);
    });
    }

    // 转义HTML特殊字符
    function escapeHtml(text) {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // 渲染分页
    function renderPagination() {
        pagination.innerHTML = '';

        const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);

        if (totalPages <= 1) return;

        // 上一页
        const prevBtn = document.createElement('button');
        prevBtn.className = 'pagination-btn';
        prevBtn.textContent = '上一页';
        prevBtn.disabled = currentPage === 1;
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderQuestionList();
                renderPagination();
            }
        });
        pagination.appendChild(prevBtn);

        // 页码
        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = 'pagination-btn';
            pageBtn.textContent = i;
            pageBtn.disabled = i === currentPage;
            pageBtn.style.backgroundColor = i === currentPage ? '#3256b3' : '#4169e1';
            pageBtn.addEventListener('click', () => {
                currentPage = i;
                renderQuestionList();
                renderPagination();
            });
            pagination.appendChild(pageBtn);
        }

        // 下一页
        const nextBtn = document.createElement('button');
        nextBtn.className = 'pagination-btn';
        nextBtn.textContent = '下一页';
        nextBtn.disabled = currentPage === totalPages;
        nextBtn.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderQuestionList();
                renderPagination();
            }
        });
        pagination.appendChild(nextBtn);
    }

    // 打开编辑器
    function openEditor(questionId = null) {
        currentQuestionId = questionId;
        questionForm.reset();
        clearFormFields();

        if (questionId) {
            // 编辑现有题目
            editorTitle.textContent = '编辑题目';
            const question = questions.find(q => q.id === questionId);
            if (question) {
                populateForm(question);
            }
        } else {
            // 新建题目
            editorTitle.textContent = '新建题目';
            // 设置默认值
            document.getElementById('level').value = 1;
            document.getElementById('type').value = 'choice';
            document.getElementById('difficulty').value = 1;
            // 添加默认选项
            addOptionFields();
            addOptionFields();
        }

        questionEditor.style.display = 'flex';
    }

    // 关闭编辑器
    function closeEditor() {
        questionEditor.style.display = 'none';
        currentQuestionId = null;
    }

    // 清空表单字段
    function clearFormFields() {
        // 清空选项字段
        const optionContainer = document.getElementById('options-container');
        if (optionContainer) {
            optionContainer.innerHTML = '';
        }

        // 清空标签字段
        const tagsContainer = document.getElementById('tags-container');
        if (tagsContainer) {
            tagsContainer.innerHTML = '';
        }
    }

    // 填充表单
    function populateForm(question) {
        document.getElementById('id').value = question.id;
        document.getElementById('year').value = question.year;
        document.getElementById('month').value = question.month;
        document.getElementById('level').value = question.level;
        document.getElementById('type').value = question.type;
        document.getElementById('question').value = question.question;
        document.getElementById('answer').value = question.answer;
        document.getElementById('explanation').value = question.explanation;
        document.getElementById('difficulty').value = question.difficulty;

        // 添加选项
        if (question.options && question.options.length > 0) {
            question.options.forEach(option => {
                addOptionFields(option.key, option.value);
            });
        } else if (question.type === 'choice') {
            // 如果是选择题但没有选项，添加默认选项
            addOptionFields('A', '');
            addOptionFields('B', '');
        }

        // 添加标签
        question.tags.forEach(tag => {
            addTagField(tag);
        });

        // 如果没有标签，添加一个空标签字段
        if (question.tags.length === 0) {
            addTagField('');
        }
    }

    // 初始化图片上传
    function initImageUpload() {
        const imageUpload = document.getElementById('image-upload');
        const imagePreview = document.getElementById('image-preview');

        if (imageUpload && imagePreview) {
            imageUpload.addEventListener('change', function(e) {
                const files = e.target.files;
                if (files) {
                    for (let i = 0; i < files.length; i++) {
                        const file = files[i];
                        if (file.type.startsWith('image/')) {
                            const reader = new FileReader();
                            reader.onload = function(event) {
                                const previewContainer = document.createElement('div');
                                previewContainer.className = 'preview-container';

                                const img = document.createElement('img');
                                img.src = event.target.result;
                                img.className = 'preview-image';

                                const removeBtn = document.createElement('button');
                                removeBtn.className = 'remove-image-btn';
                                removeBtn.textContent = '×';
                                removeBtn.addEventListener('click', function() {
                                    previewContainer.remove();
                                });

                                previewContainer.appendChild(img);
                                previewContainer.appendChild(removeBtn);
                                imagePreview.appendChild(previewContainer);
                            };
                            reader.readAsDataURL(file);
                        }
                    }
                }
            });
        }
    }

    // 动态生成表单
    function generateForm() {
        questionForm.innerHTML = `
            <div class="form-group">
                <label for="id">题目ID:</label>
                <input type="text" id="id" name="id" placeholder="例如: 2024_12_01" required>
            </div>
            <div class="form-group">
                <label for="year">年份:</label>
                <input type="number" id="year" name="year" min="2020" max="2100" required>
            </div>
            <div class="form-group">
                <label for="month">月份:</label>
                <input type="number" id="month" name="month" min="1" max="12" required>
            </div>
            <div class="form-group">
                <label for="level">难度等级:</label>
                <select id="level" name="level" required>
                    <option value="1">等级1</option>
                    <option value="2">等级2</option>
                    <option value="3">等级3</option>
                    <option value="4">等级4</option>
                    <option value="5">等级5</option>
                    <option value="6">等级6</option>
                    <option value="7">等级7</option>
                    <option value="8">等级8</option>
                </select>
            </div>
            <div class="form-group">
                <label for="type">题目类型:</label>
                <select id="type" name="type" required>
                    <option value="choice">选择题</option>
                    <option value="judge">判断题</option>
                </select>
            </div>
            <div class="form-group">
                <label for="question">题目内容:</label>
                <textarea id="question" name="question" required></textarea>
            </div>
            <div class="form-group">
                <label>代码块（可选）:</label>
                <div class="code-editor">
                    <select id="code-language" name="code-language">
                        <option value="none">无代码</option>
                        <option value="javascript">JavaScript</option>
                        <option value="python">Python</option>
                        <option value="java">Java</option>
                        <option value="c">C</option>
                        <option value="cpp">C++</option>
                        <option value="html">HTML</option>
                        <option value="css">CSS</option>
                    </select>
                    <textarea id="code-block" name="code-block" rows="6" placeholder="在此输入代码块..."></textarea>
                </div>
            </div>
            <div class="form-group">
                <label>图片上传（可选）:</label>
                <div class="image-upload">
                    <input type="file" id="image-upload" name="image-upload" accept="image/*" multiple>
                    <div id="image-preview"></div>
                </div>
            </div>
            <div id="options-container">
                <!-- 选项会动态添加 -->
            </div>
            <button type="button" id="add-option-btn" class="add-option-btn">添加选项</button>
            <div class="form-group">
                <label for="answer">正确答案:</label>
                <input type="text" id="answer" name="answer" placeholder="选择题填写选项字母，判断题填写true或false" required>
            </div>
            <div class="form-group">
                <label for="explanation">答案解析:</label>
                <textarea id="explanation" name="explanation"></textarea>
            </div>
            <div class="form-group">
                <label for="difficulty">难度星级 (1-5):</label>
                <select id="difficulty" name="difficulty" required>
                    <option value="1">1星</option>
                    <option value="2">2星</option>
                    <option value="3">3星</option>
                    <option value="4">4星</option>
                    <option value="5">5星</option>
                </select>
            </div>
            <div id="tags-container">
                <!-- 标签会动态添加 -->
            </div>
            <button type="button" id="add-tag-btn" class="add-option-btn">添加标签</button>
            <div class="form-actions">
                <button type="submit">保存题目</button>
                <button type="button" id="cancel-btn">取消</button>
            </div>
        `;

        // 添加事件监听
        document.getElementById('add-option-btn').addEventListener('click', addOptionFields);
        document.getElementById('add-tag-btn').addEventListener('click', () => addTagField(''));
        document.getElementById('cancel-btn').addEventListener('click', closeEditor);
        document.getElementById('type').addEventListener('change', function() {
            const optionsContainer = document.getElementById('options-container');
            const addOptionBtn = document.getElementById('add-option-btn');
            const answerInput = document.getElementById('answer');

            if (this.value === 'choice') {
                // 显示选项容器和添加选项按钮
                optionsContainer.style.display = 'block';
                addOptionBtn.style.display = 'block';
                answerInput.placeholder = '填写选项字母 (如: A, B, C, D)';

                // 如果没有选项，添加两个默认选项
                if (optionsContainer.children.length === 0) {
                    addOptionFields('A', '');
                    addOptionFields('B', '');
                }
            } else {
                // 隐藏选项容器和添加选项按钮
                optionsContainer.style.display = 'none';
                addOptionBtn.style.display = 'none';
                answerInput.placeholder = '填写 true 或 false';
            }
        });
    }

    // 添加选项字段
    function addOptionFields(key = '', value = '') {
        const optionsContainer = document.getElementById('options-container');
        if (!optionsContainer) return;

        const optionGroup = document.createElement('div');
        optionGroup.className = 'option-group';

        optionGroup.innerHTML = `
            <div class="form-group">
                <label>选项字母:</label>
                <input type="text" class="option-key" value="${key}" placeholder="例如: A" maxlength="1" required>
            </div>
            <div class="form-group">
                <label>选项内容:</label>
                <textarea class="option-value" required>${value}</textarea>
            </div>
            <div class="form-group">
                <label>选项代码块（可选）:</label>
                <div class="code-editor">
                    <select class="option-code-language">
                        <option value="none">无代码</option>
                        <option value="javascript">JavaScript</option>
                        <option value="python">Python</option>
                        <option value="java">Java</option>
                        <option value="c">C</option>
                        <option value="cpp">C++</option>
                        <option value="html">HTML</option>
                        <option value="css">CSS</option>
                    </select>
                    <textarea class="option-code-block" rows="3" placeholder="在此输入选项代码块..."></textarea>
                </div>
            </div>
            <button type="button" class="remove-option-btn">删除选项</button>
        `;

        // 添加删除按钮事件
        optionGroup.querySelector('.remove-option-btn').addEventListener('click', () => {
            optionGroup.remove();
        });

        optionsContainer.appendChild(optionGroup);
    }

    // 添加标签字段
    function addTagField(value = '') {
        const tagsContainer = document.getElementById('tags-container');
        if (!tagsContainer) return;

        const tagGroup = document.createElement('div');
        tagGroup.className = 'form-group';

        tagGroup.innerHTML = `
            <div style="display: flex; gap: 0.5rem;">
                <input type="text" class="tag-value" value="${value}" placeholder="输入标签" required>
                <button type="button" class="remove-option-btn">删除</button>
            </div>
        `;

        // 添加删除按钮事件
        tagGroup.querySelector('.remove-option-btn').addEventListener('click', () => {
            tagGroup.remove();
        });

        tagsContainer.appendChild(tagGroup);
    }

    // 保存题目
    function saveQuestion(e) {
        e.preventDefault();

        // 收集表单数据
        const questionData = {
            id: document.getElementById('id').value,
            year: parseInt(document.getElementById('year').value),
            month: parseInt(document.getElementById('month').value),
            level: parseInt(document.getElementById('level').value),
            type: document.getElementById('type').value,
            question: document.getElementById('question').value,
            answer: document.getElementById('answer').value,
            explanation: document.getElementById('explanation').value,
            difficulty: parseInt(document.getElementById('difficulty').value),
            options: [],
            tags: [],
            codeBlock: null,
            images: []
        };

        // 收集代码块
        const codeLanguage = document.getElementById('code-language').value;
        const codeBlock = document.getElementById('code-block').value.trim();
        if (codeLanguage !== 'none' && codeBlock) {
            questionData.codeBlock = {
                language: codeLanguage,
                content: codeBlock
            };
        }

        // 收集图片
        const imagePreview = document.getElementById('image-preview');
        const imageElements = imagePreview.querySelectorAll('img');
        imageElements.forEach(img => {
            questionData.images.push(img.src);
        })

        // 收集选项
        if (questionData.type === 'choice') {
            const optionGroups = document.querySelectorAll('.option-group');
            optionGroups.forEach(group => {
                const key = group.querySelector('.option-key').value;
                const value = group.querySelector('.option-value').value;
                if (key && value) {
                    const option = { key, value };
                    
                    // 收集选项代码块
                    const codeLanguage = group.querySelector('.option-code-language').value;
                    const codeBlock = group.querySelector('.option-code-block').value.trim();
                    if (codeLanguage !== 'none' && codeBlock) {
                        option.codeBlock = {
                            language: codeLanguage,
                            content: codeBlock
                        };
                    }
                    
                    questionData.options.push(option);
                }
            });
        }

        // 收集标签
        const tagInputs = document.querySelectorAll('.tag-value');
        tagInputs.forEach(input => {
            const tag = input.value.trim();
            if (tag) {
                questionData.tags.push(tag);
            }
        });

        // 验证数据
        if (!questionData.id || !questionData.question || !questionData.answer) {
            showStatus('error', '请填写必填字段');
            return;
        }

        if (questionData.type === 'choice' && questionData.options.length < 2) {
            showStatus('error', '选择题至少需要两个选项');
            return;
        }

        if (questionData.type === 'judge' && !['true', 'false'].includes(questionData.answer.toLowerCase())) {
            showStatus('error', '判断题答案必须是 true 或 false');
            return;
        }

        // 保存题目
        showStatus('loading', '正在保存题目...');

        // 在实际应用中，这里会通过API保存到后端
        setTimeout(() => {
            if (currentQuestionId) {
                // 更新现有题目
                const index = questions.findIndex(q => q.id === currentQuestionId);
                if (index !== -1) {
                    questions[index] = questionData;
                }
            } else {
                // 添加新题目
                questions.push(questionData);
            }

            filterQuestions();
            closeEditor();
            showStatus('success', '题目保存成功');
        }, 800);
    }

    // 显示状态消息
    function showStatus(type, message) {
        // 清除现有状态消息
        const existingStatus = document.querySelector('.status-message');
        if (existingStatus) {
            existingStatus.remove();
        }

        const statusElement = document.createElement('div');
        statusElement.className = `status-message ${type}`;
        statusElement.textContent = message;

        questionList.parentNode.insertBefore(statusElement, questionList);

        // 3秒后自动隐藏成功和错误消息
        if (type !== 'loading') {
            setTimeout(() => {
                statusElement.remove();
            }, 3000);
        }
    }

    // 生成表单
    generateForm();
});