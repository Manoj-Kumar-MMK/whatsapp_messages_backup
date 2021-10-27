const qrcode = require("qrcode-terminal")
const fs = require("fs")
const { Client } = require("whatsapp-web.js")

const file_path = "./session.json"

const client = new Client({
	/* puppeteer: {
		args: ["--no-sandbox"],
	}, */
})
const logSession = async () => {
	client.on("qr", (qr) => {
		qrcode.generate(qr, { small: true })
	})
	client.on("ready", () => {
		console.log("Client is ready!")
	})
	client.initialize()
	client.on("authenticated", (session) => {
		fs.writeFile(file_path, JSON.stringify(session), (err) => {
			if (err) {
				console.error(err)
			}
		})
	})
}
logSession().then(() => console.log("ready"))
