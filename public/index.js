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
    }
}

const controller = async (middleware) => {
    const inputFile = document.querySelector('#file');
    const button = document.querySelector("#button");
    const container = document.querySelector('#image-container');
    const imageTable = document.querySelector('#image-table');
    const carouselImages = document.querySelector('#carousel-images');
    const homeButton = document.querySelector("#home-button");
    const publicPage = document.querySelector("#public-page");
    const adminPage = document.querySelector("#admin-page");

    const loadImages = async () => {
        const images = await middleware.load();
        container.innerHTML = '';
        imageTable.innerHTML = '';
        carouselImages.innerHTML = '';
        images.forEach((image, index) => {
            const imgElement = `<img src="${image.url}" alt="Image"/>`;
            container.innerHTML += imgElement;

            const row = `
                <tr>
                    <td>${image.id}</td>
                    <td>${image.url}</td>
                    <td><button class="btn btn-danger delete-button" data-id="${image.id}">Delete</button></td>
                </tr>
            `;
            imageTable.innerHTML += row;

            let carouselItem = '<div class="carousel-item';
            if (index === 0) {
                carouselItem += ' active';
            }
            carouselItem += `">
                <img src="${image.url}" alt="Image">
            </div>`;
            carouselImages.innerHTML += carouselItem;
        });

        document.querySelectorAll('.delete-button').forEach(button => {
            button.onclick = async () => {
                const id = button.getAttribute('data-id');
                await deleteImage(id);
            };
        });
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        await middleware.upload(inputFile);
        await loadImages();
    }

    const deleteImage = async (id) => {
        await middleware.delete(id);
        await loadImages();
    }

    button.onclick = handleSubmit;

    homeButton.onclick = () => {
        adminPage.style.display = "none";
        publicPage.style.display = "block";
    }

    await loadImages();
}

controller(createMiddleware());