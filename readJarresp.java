import org.apache.commons.math3.distribution.NormalDistribution;

public class ReadJarResponse {
    private static final String SERVER_HOST = "localhost";
    private static final int SERVER_PORT = 9010;

    public static void main(String[] args) {
        try {
            Socket socket = new Socket(SERVER_HOST, SERVER_PORT);
            System.out.println("Connected to the server on port " + SERVER_PORT);

            // Send an initial request packet
            OutputStream outputStream = socket.getOutputStream();
            outputStream.write(1); // Send a single byte as the initial request
            System.out.println("Initial request sent");

            // Receive and process market data packets
            InputStream inputStream = socket.getInputStream();
            byte[] buffer = new byte[130]; // market data packet size is 130 bytes
            while (true) {
                // Read a market data packet
                int bytesRead = inputStream.read(buffer);
                if (bytesRead == -1) {
                    break; // End of stream
                }

                // Process the market data packet
                processMarketDataPacket(buffer, bytesRead);
            }

            // Close the socket
            socket.close();
            System.out.println("Disconnected from the server");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private static void processMarketDataPacket(byte[] packetData, int packetSize) {

        // Extract relevant fields from the packet
        String tradingSymbol = new String(packetData, 4, 30).trim();
        long sequenceNumber = getLongFromLittleEndian(packetData, 34);
        long timeStamp = getLongFromLittleEndian(packetData, 42);
        long lastTradedPrice = getLongFromLittleEndian(packetData, 50);
        long lastTradedQuantity = getLongFromLittleEndian(packetData, 58);
        long totalTradedVolume = getLongFromLittleEndian(packetData, 66);
        long bestBid = getLongFromLittleEndian(packetData, 74);
        long bestBidQty = getLongFromLittleEndian(packetData, 82);
        long bestAsk = getLongFromLittleEndian(packetData, 90);
        long bestAskQty = getLongFromLittleEndian(packetData, 98);
        long openInterest = getLongFromLittleEndian(packetData, 106);
        long prevClosePrice = getLongFromLittleEndian(packetData, 114);
        long prevOpenInterest = getLongFromLittleEndian(packetData, 122);
        String option = "";

        // Extract other fields as needed

        // Option-type
        if (tradingSymbol.endsWith("CE")) {
            option = "Call";
        } else if (tradingSymbol.endsWith("PE")) {
            option = "Put";
        }

        // Index
        String a = "ALLBANKS";
        String b = "MAINIDX";
        String c = "FINANCIAL";
        String d = "MIDCAPS";

        int len_symbol = tradingSymbol.length();

        String index = "";

        if (tradingSymbol.startsWith(a)) {
            index = a;
        } else if (tradingSymbol.startsWith(b)) {
            index = b;
        } else if (tradingSymbol.startsWith(c)) {
            index = c;
        } else if (tradingSymbol.startsWith(d)) {
            index = d;
        }

        // Calculate implied volatility (IV) using the Black Scholes formula
        double underlyingPrice = lastTradedPrice
