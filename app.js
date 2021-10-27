const fs = require("fs")
const { Client } = require("whatsapp-web.js")

if (!fs.existsSync("./session.json")) {
	console.log("Session file not found")
	throw error
}

let client

const helper = {
	useSession: async () => {
		const session = require("./session.json")
		client = new Client({
			session: session /* 
		puppeteer: {
			args: ["--no-sandbox"],
		}, */,
		})
		await client.initialize()
		await client.on("ready", () => {
			console.log("Client is ready!")
		})
	},
	getPrivateChats: async () => {
		const chats = await client.getChats()
		const privateChats = chats.filter((chat) => {
			return !chat.isGroup
		})
		const chatIds = privateChats.map((chat) => {
			if (!chat.isGroup) return chat.id._serialized
		})
		return chatIds
	},
	getChatById: async (id) => {
		const messages = await client.searchMessages(" ", { chatId: id })
		const textMessages = messages.filter((message) => !message.hasMedia)
		const result = textMessages.map((message) => {
			return {
				from: message.from,
				to: message.to,
				message: message.body,
				timestamp: message.timestamp,
			}
		})
		return result
	},
}

let upload = []
const run = async () => {
	await helper.useSession(client)
	const chatIds = await helper.getPrivateChats(client)
	const res = await Promise.all(
		chatIds.map(async (id) => {
			const res = await helper.getChatById(id)
			upload.push(...res)
		})
	)
	fs.writeFileSync("./messages.json", JSON.stringify(upload), (err) => {
		console.log("Error uploading to messages.json")
	})
	console.log("Uploaded the chats")
}

//Main function
run()
