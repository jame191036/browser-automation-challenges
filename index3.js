const puppeteer = require('puppeteer');

// async function openBrowser(data) {
const openBrowser = async (data) => {
  const browser = await puppeteer.launch({ headless: false }); // เปิด browser แบบมีส่วนหัว
  const page = await browser.newPage(); // สร้าง page ใหม่
  await page.setViewport({ width: 1280, height: 800 });
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  await page.goto('https://dtinth.github.io/bacblog/'); // ไปที่ URL ที่ต้องการ

  let dataEntry = data;
  let dataArticle = [];

  while (true) {  // Infinite loop
    await page.waitForSelector('ul.post-list', { visible: true }); // More specific selector
    const selector = 'ul.post-list > li';
    const elements = await page.$$(selector);

    if (elements) {
      for (const element of elements) {
        const text = await element.$eval('h3 a.post-link', el => el.textContent.trim());

        dataArticle.push(text)
        // const matchedItem = data?.find(item => item['Article title'] === text);

        // if (matchedItem) {
        //   console.log('Match found:', matchedItem);
        //   break;
        // }

        const index = dataEntry.findIndex(item => item['Article title'] === text);

        if (index !== -1) {
          dataEntry.splice(index, 1); // Remove 1 item at found index
          // break;
        }
      }
    }

    await page.waitForSelector('div.pager ul', { visible: true });
    const selectorFooter = 'div.pager ul > li';

    const elementsFooter = await page.$$(selectorFooter); // Get all <li> elements

    const text = await elementsFooter[(elementsFooter.length) - 1].evaluate(el => el.textContent.trim()); // Get text content

    if (text === '•') {
      console.log('Found "•", stopping loop.');
      break; // Stop the inner loop
    } else {
      elementsFooter[(elementsFooter.length) - 1].click();
      await delay(500);
    }
  }


  // Find duplicates by counting occurrences
  const countMap = dataArticle.reduce((acc, article) => {
    acc[article] = (acc[article] || 0) + 1;  // Count occurrences
    return acc;
  }, {});

  // Get articles that appear more than once (duplicates)
  const duplicates = Object.entries(countMap)
    .filter(([article, count]) => count > 1)
    .map(([article, count]) => article);

  console.log(' Missing Article', dataEntry);
  console.log('Duplicate articles:', duplicates);

  await browser.close(); // ปิด browser (ถ้าต้องการ)
}


// async function openBrowser2(data) {
const openBrowser2 = async (data) => {
  const browser = await puppeteer.launch({ headless: false }); // เปิด browser แบบมีส่วนหัว
  const page = await browser.newPage(); // สร้าง page ใหม่
  await page.setViewport({ width: 1280, height: 800 });
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  await page.goto('https://dtinth.github.io/bacblog/'); // ไปที่ URL ที่ต้องการ
  let dataIncorrectWordCount = [];

  while (true) {  // Infinite loop
    await page.waitForSelector('ul.post-list', { visible: true }); // More specific selector
    const selector = 'ul.post-list > li';
    const elements = await page.$$(selector);

    if (elements) {
      for (let index = 0; index < elements.length; index++) {
        await page.waitForSelector('ul.post-list', { visible: true }); // More specific selector
        const selector = 'ul.post-list > li';
        const elementContent = await page.$$(selector);

        await elementContent[index].click();
        await page.waitForNavigation({ waitUntil: "domcontentloaded" });  // Ensures navigation completes

        const selectorHeader = 'header.post-header h1';
        await page.waitForSelector(selectorHeader, { visible: true });
        const textHeader = await page.$eval(selectorHeader, el => el.textContent.trim());

        const dataWords = await data.find(x => x['Article title'] == textHeader);

        if (dataWords) {
          const selectorContent = 'div.post-content.e-content p';
          await page.waitForSelector(selectorContent, { visible: true });
          const textContent = await page.$eval(selectorContent, el => el.textContent.trim());
          const wordCount = textContent.split(/\s+/).length;

          // console.log('เจอ', dataWords['Number of words']);
          // console.log(wordCount);

          if (dataWords['Number of words'] != wordCount) {
            dataIncorrectWordCount.push(dataWords);
          }
        } else {
          console.log('หาไม่เจอ', textHeader);
          console.log('data', data);

          break;

          // console.log('หาไม่เจอ2', data);
          // break;
        }

        // await delay(1000);
        await page.goBack();
      }
    }

    await page.waitForSelector('div.pager ul', { visible: true });
    const selectorFooter = 'div.pager ul > li';

    const elementsFooter = await page.$$(selectorFooter); // Get all <li> elements

    const text = await elementsFooter[(elementsFooter.length) - 1].evaluate(el => el.textContent.trim()); // Get text content

    if (text === '•') {
      console.log('Found "•", stopping loop.');
      break; // Stop the inner loop
    } else {
      elementsFooter[(elementsFooter.length) - 1].click();
      await page.waitForNavigation({ waitUntil: "domcontentloaded" });  // Ensures navigation completes
      // await delay(500);
    }
  }

  console.log('dataIncorrectWordCount,', dataIncorrectWordCount);
}

// const fs = require('fs');
// const csv = require('csv-parser');
// const { text } = require('stream/consumers');

// const results = [];

// // อ่านไฟล์ CSV
// fs.createReadStream('dataBlog.csv')
//   .pipe(csv())
//   .on('data', (data) => results.push(data)) // เพิ่มข้อมูลแต่ละแถวเข้าไปในอาร์เรย์
//   .on('end', () => {
//     openBrowser(results)
//     openBrowser2(results)
//   });

// console.log(results);

// ✅ Now use `await` inside an `async` function

const fs = require('fs');
const csv = require('csv-parser');

const readCSV = () => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream('dataBlog.csv')
      .pipe(csv())
      .on('data', (data) => results.push(data)) // Push data into results array
      .on('end', () => resolve(results))  // Resolve the promise when done
      .on('error', (error) => reject(error));
  });
};

(async () => {
  try {
    const results = await readCSV(); // Wait for CSV reading to finish
    openBrowser2([...results]); // Pass a shallow copy
    openBrowser([...results]); // Pass a shallow copy

    console.log('Both browsers opened successfully!');
  } catch (error) {
    console.error('Error reading CSV:', error);
  }
})();

// openBrowser(results);
