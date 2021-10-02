const domElements = {
    uploaderForm: document.querySelector('#uploader-form'),
    fileInput: document.querySelector('#file-input'),
    submitInput: document.querySelector('#submit-input'),
    progressIndicator: document.querySelector('#progress-indicator')
}

domElements.uploaderForm.addEventListener('submit', e => {
    e.preventDefault();

    const fileSubmission = domElements.fileInput.files[0];
    const fileName = fileSubmission.name.split('.');
    fileName.splice(fileName.length - 1, 0, `-${Date.now()}.`);

    const fileReader = new FileReader();
    fileReader.onprogress = progress => {
        console.log(`file loading-- ${Math.floor((progress.loaded / progress.total) * 100)}%`) //show loaded percentage
    }
    fileReader.onload = async _ => {
        const CHUNK_SIZE = 50000; // bytes
        const bufferData = _.target.result;
        let uploadProgress = 0;

        for(let chunkSector = 0; chunkSector < bufferData.byteLength; chunkSector += CHUNK_SIZE) 
        {
            const chunk = bufferData.slice(
                chunkSector, 
                //partition data into segments of less than or equal to CHUNK_SIZE
                bufferData.byteLength - chunkSector > CHUNK_SIZE
                    ? chunkSector + CHUNK_SIZE
                    : chunkSector + bufferData.byteLength
            )
            await fetch('/upload', { //synchronous so data isn't out of order
                method: 'POST',
                headers: {
                    'content-type': 'application/octet-stream',
                    'content-length': chunk.byteLength,
                    'file-name': fileName.join('')
                },
                body: chunk
            })

            //update upload progress indicator
            uploadProgress = Math.floor(chunkSector/bufferData.byteLength * 100);
            domElements.progressIndicator.innerText = `upload progress: ${uploadProgress}%`;
        }
    //todo: verify that server has recieved the full file

    //temporary solution
    domElements.progressIndicator.innerText = 'upload progress: complete'
    //end temporary solution

    }


    fileReader.readAsArrayBuffer(fileSubmission)

})
console.log(domElements);