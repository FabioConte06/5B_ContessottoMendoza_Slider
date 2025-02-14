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
            const body = formData;
            const fetchOptions = {
                method: "POST",
                body: body
            };
            try {
                const res = await fetch("/upload", fetchOptions);
                const data = await res.json();
                console.log(data);
            } catch (e) {
                console.log(e);
            }
        }
    }
}
const controller = async (middleware) => {
    /* render */
       const inputFile = document.querySelector('#file');
       const button = document.querySelector("#button");
       handleSubmit = async (event) => {
       await middleware.upload(inputFile);
        middleware.load().then(render);
      }
      button.onclick = handleSubmit;
    }
    
    controller(createMiddleware());