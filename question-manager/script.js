document.addEventListener('DOMContentLoaded', function() {
    // 轮播图管理相关DOM元素
    const carouselManagerBtn = document.getElementById('carousel-manager-btn');
    const carouselManagerModal = document.getElementById('carousel-manager');
    const carouselCloseBtn = carouselManagerModal.querySelector('.close-btn');
    const carouselImageUpload = document.getElementById('carousel-image-upload');
    const carouselImagePreview = document.getElementById('carousel-image-preview');
    const carouselImagesContainer = document.getElementById('carousel-images-container');
    const intervalTimeInput = document.getElementById('interval-time');
    const saveCarouselSettingsBtn = document.getElementById('save-carousel-settings');
    let draggedItem = null;
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
    initFileOperations();
    initCarouselManager();
    showWelcomeMessage();

    // 初始化文件操作
    function initFileOperations() {
        const loadFileBtn = document.getElementById('load-file-btn');
        const exportJsBtn = document.getElementById('export-js-btn');
        const exportJsonBtn = document.getElementById('export-json-btn');
        const importJsonBtn = document.getElementById('import-json-btn');

        loadFileBtn.addEventListener('click', loadDataFile);
        exportJsBtn.addEventListener('click', exportJSFile);
        exportJsonBtn.addEventListener('click', exportJSONFile);
        importJsonBtn.addEventListener('click', importJSONFile);
    }

    // 显示欢迎信息
    function showWelcomeMessage() {
        questionList.innerHTML = `
            <div class="welcome-message">
                <h3>欢迎使用GESP题目管理系统</h3>
                <p>请先点击"加载数据文件"按钮，选择小程序目录下的 <code>questions_data.js</code> 文件开始管理题目。</p>
                <div class="welcome-steps">
                    <h4>使用步骤：</h4>
                    <ol>
                        <li>点击"加载数据文件"选择 <code>gesp-miniprogram/questions_data.js</code></li>
                        <li>在左侧筛选栏选择等级和类型</li>
                        <li>点击"新建题目"或点击现有题目进行编辑</li>
                        <li>编辑完成后点击"导出JS文件"保存到小程序目录</li>
                    </ol>
                </div>
            </div>
        `;
    }

    // 加载数据文件
    async function loadDataFile() {
        try {
            showLoading('正在加载数据文件...');
            const data = await window.fileManager.loadDataFromFile();
            questions = window.fileManager.getAllQuestions();
            
            showSuccess(`成功加载 ${questions.length} 道题目`);
            applyFilters();
        } catch (error) {
            showError('加载失败: ' + error);
        }
    }

    // 导出JS文件
    function exportJSFile() {
        try {
            if (questions.length === 0) {
                showError('没有题目数据可导出');
                return;
            }
            
            const success = window.fileManager.exportToFile();
            if (success) {
                showSuccess('JS文件导出成功！请将文件替换到小程序目录下的 questions_data.js');
            } else {
                showError('导出失败');
            }
        } catch (error) {
            showError('导出失败: ' + error.message);
        }
    }

    // 导出JSON备份
    function exportJSONFile() {
        try {
            if (questions.length === 0) {
                showError('没有题目数据可导出');
                return;
            }
            
            const success = window.fileManager.exportToJSON();
            if (success) {
                showSuccess('JSON备份文件导出成功！');
            } else {
                showError('导出失败');
            }
        } catch (error) {
            showError('导出失败: ' + error.message);
        }
    }

    // 导入JSON备份
    async function importJSONFile() {
        try {
            showLoading('正在导入JSON文件...');
            const data = await window.fileManager.importFromJSON();
            questions = window.fileManager.getAllQuestions();
            
            showSuccess(`成功导入 ${questions.length} 道题目`);
            applyFilters();
        } catch (error) {
            showError('导入失败: ' + error);
        }
    }

    // 显示加载状态
    function showLoading(message) {
        questionList.innerHTML = `
            <div class="loading-message">
                <div class="spinner"></div>
                <p>${message}</p>
            </div>
        `;
    }

    // 显示成功消息
    function showSuccess(message) {
        showMessage(message, 'success');
    }

    // 显示错误消息
    function showError(message) {
        showMessage(message, 'error');
    }

    // 显示消息
    function showMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }

    // 轮播图管理初始化
    function initCarouselManager() {
        // 加载保存的轮播图数据
        loadCarouselData();

        // 创建文件导入控件
        const importCarouselBtn = document.createElement('input');
        importCarouselBtn.type = 'file';
        importCarouselBtn.accept = '.json';
        importCarouselBtn.style.display = 'none';
        importCarouselBtn.id = 'import-carousel-btn';
        importCarouselBtn.addEventListener('change', loadCarouselDataFromFile);
        document.body.appendChild(importCarouselBtn);

        // 模态框控制
        carouselManagerBtn.addEventListener('click', openCarouselManager);
        carouselCloseBtn.addEventListener('click', closeCarouselManager);

        // 图片上传处理
        carouselImageUpload.addEventListener('change', handleCarouselImageUpload);

        // 保存设置
        saveCarouselSettingsBtn.addEventListener('click', saveCarouselSettings);
    }

    // 打开轮播图管理模态框
    function openCarouselManager() {
        carouselManagerModal.style.display = 'flex';
        renderCarouselImages();
    }

    // 关闭轮播图管理模态框
    function closeCarouselManager() {
        carouselManagerModal.style.display = 'none';
    }

    // 处理轮播图上传
    function handleCarouselImageUpload(e) {
        const files = e.target.files;
        if (!files.length) return;

        carouselImagePreview.innerHTML = '';

        Array.from(files).forEach(file => {
            const reader = new FileReader();
            const imgContainer = document.createElement('div');
            imgContainer.className = 'carousel-preview-item';

            reader.onload = function(event) {
                const img = new Image();
                img.src = event.target.result;
                img.className = 'carousel-preview-img';

                // 检查图片尺寸
                img.onload = function() {
                    const width = img.naturalWidth;
                    const height = img.naturalHeight;
                    const sizeHint = document.createElement('p');
                    sizeHint.className = 'preview-size-hint';
                    sizeHint.textContent = `尺寸: ${width}×${height}px`;

                    // 显示建议尺寸提示
                    if (width !== 1200 || height !== 400) {
                        sizeHint.style.color = '#ff6b6b';
                        sizeHint.textContent += ' (建议尺寸: 1200×400px)';
                    }

                    imgContainer.appendChild(img);
                    imgContainer.appendChild(sizeHint);
                };
            };

            reader.readAsDataURL(file);
            carouselImagePreview.appendChild(imgContainer);
        });
    }

    // 渲染轮播图列表
    function renderCarouselImages() {
        carouselImagesContainer.innerHTML = '';
        const carouselImages = JSON.parse(localStorage.getItem('carouselImages') || '[]');

        carouselImages.forEach((image, index) => {
            const imgContainer = document.createElement('div');
            imgContainer.className = 'carousel-image-item';
            imgContainer.setAttribute('draggable', true);
            imgContainer.setAttribute('data-index', index);

            const img = document.createElement('img');
            img.src = image.src;
            img.alt = `轮播图 ${index + 1}`;
            img.className = 'carousel-list-img';

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'carousel-delete-btn';
            deleteBtn.innerHTML = '&times;';
            deleteBtn.addEventListener('click', () => deleteCarouselImage(index));

            // 拖拽事件监听
            imgContainer.addEventListener('dragstart', handleDragStart);
            imgContainer.addEventListener('dragover', handleDragOver);
            imgContainer.addEventListener('dragend', handleDragEnd);
            imgContainer.addEventListener('drop', handleDrop);

            imgContainer.appendChild(img);
            imgContainer.appendChild(deleteBtn);
            carouselImagesContainer.appendChild(imgContainer);
        });
    }

    // 删除轮播图
    function deleteCarouselImage(index) {
        const carouselImages = JSON.parse(localStorage.getItem('carouselImages') || '[]');
        carouselImages.splice(index, 1);
        localStorage.setItem('carouselImages', JSON.stringify(carouselImages));
        renderCarouselImages();
    }

    // 拖拽排序相关函数
    function handleDragStart(e) {
        draggedItem = this;
        setTimeout(() => this.classList.add('dragging'), 0);
    }

    function handleDragOver(e) {
        e.preventDefault();
        const draggableElements = [...carouselImagesContainer.querySelectorAll('.carousel-image-item:not(.dragging)')];
        const nextElement = draggableElements.find(el => {
            return e.clientY <= el.getBoundingClientRect().top + el.getBoundingClientRect().height / 2;
        });
        if (nextElement) {
            carouselImagesContainer.insertBefore(draggedItem, nextElement);
        } else {
            carouselImagesContainer.appendChild(draggedItem);
        }
    }

    function handleDragEnd() {
        this.classList.remove('dragging');
        updateCarouselOrder();
    }

    function handleDrop(e) {
        e.preventDefault();
    }

    // 更新轮播图顺序
    function updateCarouselOrder() {
        const items = carouselImagesContainer.querySelectorAll('.carousel-image-item');
        const carouselImages = JSON.parse(localStorage.getItem('carouselImages') || '[]');
        const newOrder = [];

        items.forEach(item => {
            const index = parseInt(item.getAttribute('data-index'));
            newOrder.push(carouselImages[index]);
        });

        localStorage.setItem('carouselImages', JSON.stringify(newOrder));
        renderCarouselImages();
    }

    // 保存轮播图设置到文件和小程序目录
function saveCarouselSettingsToFile() {
    const intervalTime = parseInt(intervalTimeInput.value);
    const carouselImages = JSON.parse(localStorage.getItem('carouselImages') || '[]');
    
    const carouselData = {
        intervalTime: intervalTime,
        images: carouselImages
    };
    
    const dataStr = JSON.stringify(carouselData, null, 2);
    
    // 保存到文件供下载
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'carousel_config.json';
    document.body.appendChild(a);
    a.click();
    
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 0);
    
    // 通过HTTP请求保存到小程序目录
    fetch('http://localhost:8000/save-carousel-config', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: dataStr
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('保存配置到小程序目录失败');
        }
        return response.text();
    })
    .then(data => {
        console.log('配置已成功保存到小程序目录:', data);
    })
    .catch(error => {
        console.error('保存配置到小程序目录时出错:', error);
        alert('保存配置到小程序目录失败，请确保后台服务器正在运行');
    });
}

    // 保存轮播图设置
    function saveCarouselSettings() {
        const intervalTime = parseInt(intervalTimeInput.value);
        const previewImages = carouselImagePreview.querySelectorAll('.carousel-preview-item img');
        const carouselImages = JSON.parse(localStorage.getItem('carouselImages') || '[]');

        // 保存新上传的图片
        previewImages.forEach(img => {
            carouselImages.push({ src: img.src });
        });

        // 保存间隔时间
        localStorage.setItem('carouselInterval', intervalTime);
        // 保存图片
        localStorage.setItem('carouselImages', JSON.stringify(carouselImages));

        // 保存到文件
        saveCarouselSettingsToFile();

        // 清空预览并重新渲染列表
        carouselImagePreview.innerHTML = '';
        renderCarouselImages();

        // 显示保存成功提示
        alert('轮播图设置已保存并导出到文件！');
    }

    // 从文件加载轮播图数据
    function loadCarouselDataFromFile(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const carouselData = JSON.parse(e.target.result);
                localStorage.setItem('carouselInterval', carouselData.intervalTime);
                localStorage.setItem('carouselImages', JSON.stringify(carouselData.images));
                
                intervalTimeInput.value = carouselData.intervalTime;
                renderCarouselImages();
                alert('轮播图数据加载成功！');
            } catch (error) {
                alert('加载轮播图数据失败：' + error.message);
            }
        };
        reader.readAsText(file);
    }

    // 加载轮播图数据
    function loadCarouselData() {
        const intervalTime = localStorage.getItem('carouselInterval') || 5;
        intervalTimeInput.value = intervalTime;
    }

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
        // 如果已有数据，直接应用筛选
        if (questions.length > 0) {
            applyFilters();
            return;
        }
        
        // 否则显示欢迎信息
        showWelcomeMessage();
    }

    // 筛选题目
    // 应用筛选条件
    function applyFilters() {
        if (!window.fileManager) {
            showError('文件管理器未初始化');
            return;
        }

        const filters = {
            level: levelFilter.value,
            type: typeFilter.value,
            search: searchInput.value
        };

        filteredQuestions = window.fileManager.filterQuestions(filters);
        currentPage = 1;
        renderQuestionList();
        renderPagination();

        if (filteredQuestions.length === 0) {
            showStatus('error', '没有找到匹配的题目');
        } else {
            showStatus('success', `找到 ${filteredQuestions.length} 道题目`);
        }
    }

    // 筛选题目（兼容旧版本）
    function filterQuestions() {
        applyFilters();
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

    // 保存题目到固定目录
    function saveQuestionsToFixedDirectory() {
        showStatus('loading', '正在准备题目数据...');
        
        try {
            // 保存到本地存储作为缓存
            localStorage.setItem('questions', JSON.stringify(questions));
            
            // 生成JSON数据
            const jsonData = JSON.stringify(questions, null, 2);
            const blob = new Blob([jsonData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            // 创建下载链接
            const a = document.createElement('a');
            a.href = url;
            a.download = 'gesp_questions_' + new Date().toISOString().slice(0,10) + '.json';
            document.body.appendChild(a);
            a.click();
            
            // 清理
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 0);
            
            showStatus('success', '题目数据已成功生成并下载');
            alert('题目数据已成功生成并下载！\n请将下载的JSON文件手动放入小程序的 data/questions 目录中。');
        } catch (error) {
            console.error('生成题目数据失败:', error);
            showStatus('error', '生成题目数据失败: ' + error.message);
            alert('生成题目数据失败: ' + error.message);
        }
    }

    // 从文件加载题目数据
    function loadQuestionsFromFile(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                questions = JSON.parse(e.target.result);
                localStorage.setItem('questions', JSON.stringify(questions));
                
                filteredQuestions = [...questions];
                renderQuestionList();
                renderPagination();
                showStatus('success', '题目数据加载成功！共加载 ' + questions.length + ' 道题目');
            } catch (error) {
                alert('加载题目数据失败：' + error.message);
            }
        };
        reader.readAsText(file);
    }

    // 添加导入按钮
    function initImportExportButtons() {
        // 创建导入按钮
        const importBtn = document.createElement('input');
        importBtn.type = 'file';
        importBtn.accept = '.json';
        importBtn.style.display = 'none';
        importBtn.id = 'import-questions-btn';
        importBtn.addEventListener('change', loadQuestionsFromFile);
        document.body.appendChild(importBtn);

        // 获取页面上已有的导出按钮并添加事件监听
        const exportBtn = document.getElementById('export-questions-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', saveQuestionsToFixedDirectory);
        }
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

            // 使用文件管理器保存
            try {
                if (currentQuestionId) {
                    window.fileManager.updateQuestion(currentQuestionId, questionData);
                } else {
                    window.fileManager.addQuestion(questionData);
                }
                
                // 更新本地questions数组
                questions = window.fileManager.getAllQuestions();
                
                closeEditor();
                applyFilters();
                showSuccess('题目保存成功');
            } catch (error) {
                showError('保存失败: ' + error.message);
            }
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