// Ensure that the workerSrc is correctly set
pdfjsLib.GlobalWorkerOptions.workerSrc = 'lib/pdf.worker.mjs';

document.getElementById('fileInput').addEventListener('change', handleFileSelect);

async function handleFileSelect(event) {
    const files = event.target.files;
    const pdfContainer = document.getElementById('pdfContainer');
    pdfContainer.innerHTML = ''; // Clear previous PDFs

    for (const file of files) {
        const fileReader = new FileReader();
        fileReader.onload = function() {
            const typedArray = new Uint8Array(this.result);
            renderPDF(typedArray, pdfContainer);
        };
        fileReader.readAsArrayBuffer(file);
    }
}

async function renderPDF(data, container) {
    const loadingTask = pdfjsLib.getDocument({data: data});
    const pdf = await loadingTask.promise;
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({scale: 1.5});

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    await page.render({
        canvasContext: context,
        viewport: viewport
    }).promise;

    const pdfViewer = document.createElement('div');
    pdfViewer.classList.add('pdf-viewer');
    pdfViewer.appendChild(canvas);
    container.appendChild(pdfViewer);
}
