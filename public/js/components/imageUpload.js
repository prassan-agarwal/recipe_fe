// Image Upload Component
class ImageUploadComponent {
    static init() {
        this.uploadArea = document.getElementById('uploadArea');
        this.imageInput = document.getElementById('imageInput');
        this.uploadPreview = document.getElementById('uploadPreview');
        this.previewImage = document.getElementById('previewImage');
        this.removeImageBtn = document.getElementById('removeImage');
        this.analyzeImageBtn = document.getElementById('analyzeImage');
        
        console.log('🖼️ ImageUploadComponent initializing...');
        console.log('📁 Elements found:', {
            uploadArea: !!this.uploadArea,
            imageInput: !!this.imageInput,
            uploadPreview: !!this.uploadPreview,
            previewImage: !!this.previewImage,
            removeImageBtn: !!this.removeImageBtn,
            analyzeImageBtn: !!this.analyzeImageBtn
        });

        this.bindEvents();
        this.setupDragAndDrop();
        
        console.log('✅ ImageUploadComponent initialized successfully');
    }
    
    static bindEvents() {
        // Upload area click
        if (this.uploadArea) {
            this.uploadArea.addEventListener('click', () => {
                console.log('👆 Upload area clicked');
                this.imageInput?.click();
            });
        }
        
        // File input change
        if (this.imageInput) {
            this.imageInput.addEventListener('change', this.handleFileSelect.bind(this));
        }
        
        // Remove image
        if (this.removeImageBtn) {
            this.removeImageBtn.addEventListener('click', this.removeImage.bind(this));
        }
        
        // Analyze image
        if (this.analyzeImageBtn) {
            this.analyzeImageBtn.addEventListener('click', this.analyzeImage.bind(this));
        }
        
        // Tab switching - clear when switching away from image tab
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const tab = event.target.dataset.tab;
                console.log('📑 Tab switched to:', tab);
                if (tab !== 'image') {
                    this.removeImage();
                }
            });
        });
        
        console.log('🔗 Image upload events bound successfully');
    }
    
    static setupDragAndDrop() {
        if (!this.uploadArea) {
            console.log('❌ Upload area not found for drag and drop');
            return;
        }

        console.log('🔄 Setting up drag and drop...');

        // Prevent default drag behaviors
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            this.uploadArea.addEventListener(eventName, this.preventDefaults, false);
            document.body.addEventListener(eventName, this.preventDefaults, false);
        });
        
        // Highlight drop area when item is dragged over it
        ['dragenter', 'dragover'].forEach(eventName => {
            this.uploadArea.addEventListener(eventName, this.highlight, false);
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            this.uploadArea.addEventListener(eventName, this.unhighlight, false);
        });
        
        // Handle dropped files
        this.uploadArea.addEventListener('drop', this.handleDrop.bind(this), false);
        
        console.log('✅ Drag and drop setup completed');
    }
    
    static preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    static highlight() {
        this.classList.add('highlight');
    }
    
    static unhighlight() {
        this.classList.remove('highlight');
    }
    
    static handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        
        console.log('📂 Files dropped:', files.length);

        if (files.length > 0) {
            this.handleFiles(files);
        }
    }
    
    static handleFileSelect(event) {
        const files = event.target.files;
        console.log('📂 File selected:', files.length);

        if (files.length > 0) {
            this.handleFiles(files);
        }
    }
    
    static handleFiles(files) {
        const file = files[0];
        
        if (!file) {
            console.log('❌ No file selected');
            return;
        }

        console.log('📄 File details:', {
            name: file.name,
            type: file.type,
            size: file.size
        });

        // Validate file type
        if (!AppConfig.SETTINGS.SUPPORTED_IMAGE_TYPES.includes(file.type)) {
            console.log('❌ Invalid file type:', file.type);
            appState.setError('Please upload a valid image file (JPG, PNG, or WEBP)');
            return;
        }

        // Validate file size
        if (file.size > AppConfig.SETTINGS.MAX_IMAGE_SIZE) {
            console.log('❌ File too large:', file.size);
            appState.setError('Image size must be less than 5MB');
            return;
        }

        console.log('✅ File validation passed');
        // Preview image
        this.previewImageFile(file);
    }
    
    static previewImageFile(file) {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            this.currentImageData = e.target.result;
            console.log('🖼️ Image loaded successfully, size:', this.currentImageData.length);
            this.showPreview(this.currentImageData);
        };
        
        reader.onerror = () => {
            console.error('❌ Error reading image file');
            appState.setError('Error reading image file');
        };
        
        reader.readAsDataURL(file);
    }
    
    static showPreview(imageData) {
        if (!this.uploadArea || !this.uploadPreview || !this.previewImage) {
            console.log('❌ Preview elements not found');
            return;
        }

        console.log('🎨 Showing image preview');

        this.uploadArea.classList.add('hidden');
        this.uploadPreview.classList.remove('hidden');
        this.previewImage.src = imageData;
        this.analyzeImageBtn.disabled = false;
        
        console.log('✅ Image preview displayed');
    }
    
    static removeImage() {
        if (!this.uploadArea || !this.uploadPreview || !this.imageInput) {
            console.log('❌ Remove image elements not found');
            return;
        }

        console.log('🗑️ Removing image');

        this.uploadArea.classList.remove('hidden');
        this.uploadPreview.classList.add('hidden');
        this.previewImage.src = '';
        this.imageInput.value = '';
        this.analyzeImageBtn.disabled = true;
        this.currentImageData = null;

        // Clear any detected ingredients
        SearchFormComponent.clearDetectedIngredients();
        
        console.log('✅ Image removed');
    }
    
    static async analyzeImage() {
        if (!this.currentImageData) {
            console.log('❌ No image data to analyze');
            appState.setError('Please select an image first');
            return;
        }

        console.log('🤖 Starting image analysis with Gemini...');

        try {
            appState.setLoading(true);
            this.analyzeImageBtn.disabled = true;
            this.analyzeImageBtn.textContent = 'Analyzing...';

            const response = await apiService.analyzeImage(this.currentImageData);
            
            console.log('✅ Image analysis response:', response);

            if (response.success && response.ingredients.length > 0) {
                console.log('🎯 Ingredients detected:', response.ingredients);
                appState.setSuccess(`Detected ${response.ingredients.length} ingredients!`);
                SearchFormComponent.displayDetectedIngredients(response.ingredients);
            } else {
                console.log('❌ No ingredients detected');
                appState.setError('No ingredients detected in the image. Please try another image.');
            }

        } catch (error) {
            console.error('❌ Image analysis failed:', error);
            appState.setError(`Image analysis failed: ${error.message}`);
        } finally {
            appState.setLoading(false);
            this.analyzeImageBtn.disabled = false;
            this.analyzeImageBtn.textContent = 'Analyze Image';
            console.log('🔚 Image analysis completed');
        }
    }
    
    // Utility method to get current image data
    static getCurrentImageData() {
        return this.currentImageData;
    }
    
    // Method to check if an image is currently loaded
    static hasImage() {
        return !!this.currentImageData;
    }
}

// Add drag and drop styles
const dragDropStyles = `
<style>
.upload-area.highlight {
    border-color: #3498db;
    background-color: #f8f9fa;
}

.upload-area.highlight .upload-placeholder {
    color: #3498db;
}
</style>
`;

// Inject drag and drop styles
document.head.insertAdjacentHTML('beforeend', dragDropStyles);