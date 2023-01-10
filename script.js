const pickBtn = document.querySelector("#pick-btn");
const resultBlock = document.querySelectorAll(".inner__result")[0];
const copyBtn = document.querySelector("#copy-btn");
const color = document.querySelector("#color");
const inputColor = document.querySelector("#colorText");

pickBtn.addEventListener("click", async () => {
    const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
    chrome.scripting.executeScript({
        target: {
            tabId: tab.id
        },
        function: pickColor,
    },
    async (isOpen) => {
        const [data] = await isOpen;
        if (data.result) {
            copyBtn.innerText = "Copy";
            const expectedColor = data.result.sRGBHex;
            inputColor.value = expectedColor;
            color.style.backgroundColor = expectedColor;

            resultBlock.style.display = "block";
            copyBtn.addEventListener("click", () => {
                navigator.clipboard.writeText(expectedColor);
                copyBtn.innerText = "Done!";
            })
        }
    });
})

async function pickColor() {
    try {
        const eyeDropper = new EyeDropper();
        const isOpen = await eyeDropper.open();
        return isOpen;
    } catch (error) {
        console.log(error);
    }
}