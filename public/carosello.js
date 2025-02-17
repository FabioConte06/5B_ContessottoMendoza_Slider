const initCarosello = (images) => {
    const carouselContainer = document.querySelector('#carousel-images');
    const prevButton = document.querySelector('#prev-button');
    const nextButton = document.querySelector('#next-button');

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
                <img src="${imageUrl}" alt="Image" class="my-carousel-item-img" 
                    style="width: ${imageWidth}px; height: ${imageHeight}px; object-fit: contain;">
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
        currentImageIndex = (currentImageIndex + 1) % images.length;
        updateCarousel();
    };

    const goToPrevImage = () => {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        updateCarousel();
    };


    nextButton.onclick = goToNextImage;
    prevButton.onclick = goToPrevImage;

    loadCarouselImages();
};

export default initCarosello;
