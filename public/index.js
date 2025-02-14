const createMiddleware = () => {
    return {
        load: async () => {
            const response = await fetch("/images");
            const json = await response.json();
            return json;
        },
        delete: async (id) => {
            const response = await fetch("/delete/" + id, { method: "DELETE" });
            const json = await response.json();
            return json;
        },
        upload: async (inputFile) => {
            const formData = new FormData();
            formData.append("file", inputFile.files[0]);
            const fetchOptions = {
                method: "POST",
                body: formData
            };
            try {
                const res = await fetch("/upload", fetchOptions);
                const data = await res.json();
                return data;
            } catch (e) {
                console.error(e);
                return null;
            }
        }
    };
};

const controller = async (middleware) => {
    const inputFile = document.querySelector("#file");
    const button = document.querySelector("#button");
    const imageTable = document.querySelector("#image-table");
    const carouselImages = document.querySelector("#carousel-images");

    const renderImages = (images) => {
        imageTable.innerHTML = "";
        carouselImages.innerHTML = "";

        images.forEach((image, index) => {
            const row = `<tr>
                <td>${image.id}</td>
                <td>${image.url}</td>
                <td><button class='btn btn-danger' onclick='deleteImage(${image.id})'>Elimina</button></td>
            </tr>`;
            imageTable.innerHTML += row;

            const activeClass = index === 0 ? "active" : "";
            const carouselItem = `<div class='carousel-item ${activeClass}'>
                <img src='${image.url}' class='d-block w-100' alt='Immagine'/>
            </div>`;
            carouselImages.innerHTML += carouselItem;
        });
    };

    const loadImages = async () => {
        const images = await middleware.load();
        renderImages(images);
    };

    const handleSubmit = async () => {
        await middleware.upload(inputFile);
        await loadImages();
    };

    const deleteImage = async (id) => {
        await middleware.delete(id);
        await loadImages();
    };

    window.deleteImage = deleteImage;
    button.onclick = handleSubmit;
    
    await loadImages();
};

controller(createMiddleware());
