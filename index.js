const puppeteerExtra = require('puppeteer-extra');
const Stealth = require('puppeteer-extra-plugin-stealth');

puppeteerExtra.use(Stealth());

(async () => {
    const browser = await puppeteerExtra.launch({
        headless: false,
        // args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();

    await page.setViewport({
        width: 1440,
        height: 768
    });

    await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
    );

    await page.setDefaultNavigationTimeout(0)

    await page.goto('https://web.flypgs.com/signup', { waitUntil: 'load', timeout: 0 });

    await page.waitForNetworkIdle(); // Wait for network resources to fully load

    await page.type("#mui-5", "Petro");
    await page.type("#mui-6", "Bakumenko");
    await page.type("#mui-7", "544");
    await page.type("#mui-8", "123 45 67");
    await page.type("#mui-9", "petrobakumenko22@gmail.com");

    await page.waitForSelector('[data-testid="sms-permission-checkbox"]', { visible: true, timeout: 60000 });
    await page.click('[data-testid="sms-permission-checkbox"]');

    await page.waitForSelector('[data-testid="email-permission-checkbox"]', { visible: true, timeout: 60000 });
    await page.click('[data-testid="email-permission-checkbox"]');

    await page.evaluate(() => {
        const element = document.querySelector('.terms-and-conditions > label > span');
        if (element) {
            console.log('Element found:', element);
            element.click();
        } else {
            console.log('Element not found');
        }
    });

    await new Promise(resolve => setTimeout(resolve, 3000));


    await page.waitForSelector('iframe[src*="recaptcha"]', { visible: true, timeout: 60000 });

    const frames = await page.frames();
    const recaptchaFrame = frames.find(frame => frame.url().includes('recaptcha'));
    const recaptchaCheckbox = await recaptchaFrame.$('#recaptcha-anchor');

    await recaptchaCheckbox.click();

    console.log('Please manually complete the CAPTCHA.');

    await new Promise(resolve => setTimeout(resolve, 10000));

    await page.waitForSelector('.signup-form-button', { visible: true, timeout: 60000 });
    await page.click('.signup-form-button');
    console.log('submit click');

    // await browser.close();
})();