import app from "./app";
import "dotenv/config";
import connectMongoDB from "./configs/connectMongoDB.config";
import http from "http";
const PORT = process.env.PORT || 3001;

const server = http.createServer(app);

server.listen(PORT, () => {
	console.log(`[SUCCESS] Server is listening on port ${PORT}`);
	console.log(
		`[INFO] API document is available on: http://localhost:${PORT}/api/docs`
	);
});

connectMongoDB();
