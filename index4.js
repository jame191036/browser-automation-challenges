const puppeteer = require('puppeteer');

async function openBrowser() {
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    const browser = await puppeteer.launch({ headless: false }); // เปิด browser แบบมีส่วนหัว
    const page = await browser.newPage(); // สร้าง page ใหม่
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto('https://showdownspace-rpa-challenge.vercel.app/challenge-robot-d34b4b04/'); // ไปที่ URL ที่ต้องการ

    await page.waitForSelector('.chakra-button.css-jut409'); // More specific selector
    const button = await page.$('.chakra-button.css-jut409');

    if (button) {
        await button.click();

        // await page.waitForSelector('div.css-1psercc', { visible: true }); // More specific selector
        // const selector = 'div.css-1psercc > *';
        // const elementContent = await page.$$(selector);

        await page.waitForSelector('div.css-1fpbagy', { visible: true }); // More specific selector
        const selectorButtonTurn = 'div.css-1fpbagy > button';
        const elementButtonTurn = await page.$$(selectorButtonTurn);

        // console.log('ele', elementButtonTurn);

        let i = 0;
        while (i < 1000) {
            i++;

            try {
                await page.waitForSelector('div.css-1psercc', { visible: true, timeout: 2000 }); // Timeout after 5 seconds
            } catch (error) {
                console.log('Selector not found in time, ending loop');
                break; // End loop if timeout is reached or selector is not found
            }

            // await page.waitForSelector('div.css-1psercc', { visible: true }); // More specific selector
            // const selector = 'div.css-1psercc > *';
            // const elementContent = await page.$$(selector);


            // const styleLeft = await elementContent[1].$eval('div.css-1psercc', el => el.getAttribute('style'));
            const dataStateLeft = await page.$eval('#wallToTheLeft', el => el.getAttribute('data-state'));
            const dataStateRight = await page.$eval('#wallToTheRight', el => el.getAttribute('data-state'));
            const dataStateWallInFront = await page.$eval('button#wallInFront', el => el.getAttribute('data-state'));

            const selectorButton = 'button#wallInFront';
            // Wait for the button to be available
            await page.waitForSelector(selectorButton, { visible: true });
            const dataState = await page.$(selectorButton);

            await page.waitForSelector('div.css-1fpbagy', { visible: true }); // More specific selector
            const selectorButtonTurn = 'div.css-1fpbagy > button.chakra-button';
            const elementContentTurn = await page.$$(selectorButtonTurn);

            if (dataStateWallInFront == 'present') {
                if (dataStateLeft == 'absent') {
                    await elementContentTurn[0].click();
                } else if (dataStateRight == 'absent') {
                    await elementContentTurn[1].click();
                } else {
                    await elementContentTurn[0].click();
                    await elementContentTurn[0].click();
                }
            } else if (dataStateWallInFront == 'absent' && dataStateLeft == 'absent' && dataStateRight == 'present') {
                await elementContentTurn[0].click();
                console.log('left');
                // break;
            } else if (dataStateWallInFront == 'absent' && dataStateLeft == 'absent' && dataStateRight == 'absent') {
                await elementContentTurn[0].click();
                await elementContentTurn[0].click();
                console.log('return');
            }

            // await delay(1500)
            await dataState.click();
            // console.log('dataStateLeft', dataStateLeft);
            // console.log('dataStateRight', dataStateRight);
            // console.log('dataStateWallInFront', dataStateWallInFront);

            console.log('i', i);
        }
    } else {
        console.log('Button not found!');
    }
}

openBrowser();