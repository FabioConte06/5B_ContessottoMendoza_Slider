const initCarosello = (images) => {
    const carouselContainer = document.querySelector('#carousel-images');
    const prevButton = document.querySelector('#prev-button');
    const nextButton = document.querySelector('#next-button');
;
    console.log(prevButton, nextButton); 
    let currentImageIndex = 0;

    const imageWidth = 600; 
    const imageHeight = 400; 

    const updateCarousel = () => {
        const carouselItems = document.querySelectorAll('.my-carousel-item');
        carouselItems.forEach((item) => item.classList.remove('active'));

        const currentItem = carouselItems[currentImageIndex];
        if (currentItem) {
            currentItem.classList.add('active');
        }
    };


    const createCarouselItem = (imageUrl, index) => {
        return `
            <div class="my-carousel-item ${index === 0 ? 'active' : ''}">
                <img src="${imageUrl}" alt="Image" class="my-carousel-item-img" style="width: ${imageWidth}px; height: ${imageHeight}px; object-fit: contain;">
            </div>
        `;
    };

    const loadCarouselImages = () => {
        carouselContainer.innerHTML = ''; 
        images.forEach((image, index) => {
            carouselContainer.innerHTML += createCarouselItem(image.url, index);
        });
    };


    const goToNextImage = () => {
        if (currentImageIndex < images.length - 1) {
            currentImageIndex++;
        } else {
            currentImageIndex = 0; 
        }
        updateCarousel();
    };

    const goToPrevImage = () => {
        if (currentImageIndex > 0) {
            currentImageIndex--;
        } else {
            currentImageIndex = images.length - 1; 
        }
        updateCarousel();
    };


    nextButton.addEventListener('click', goToNextImage);
    prevButton.addEventListener('click', goToPrevImage);


    loadCarouselImages();
};

export default initCarosello;
