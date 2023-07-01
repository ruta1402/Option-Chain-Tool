package backend;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.Socket;

public class ReadJarResponse {
    private static final String SERVER_HOST = "localhost"; // Replace with the actual server host
    private static final int SERVER_PORT = 9010; // Replace with the actual server port

    public static void main(String[] args) {
        try {
            // Connect to the server
            Socket socket = new Socket(SERVER_HOST, SERVER_PORT);
            System.out.println("Connected to the server.");

            // Send an initial request packet
            OutputStream outputStream = socket.getOutputStream();
            outputStream.write(1); // Send a single byte as the initial request
            System.out.println("Initial request sent.");

            // Receive and process market data packets
            InputStream inputStream = socket.getInputStream();
            byte[] buffer = new byte[130]; // Assuming the market data packet size is 130 bytes
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
            System.out.println("Disconnected from the server.");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private static void processMarketDataPacket(byte[] packetData, int packetSize) {
        // Extract relevant fields from the packet
        String tradingSymbol = new String(packetData, 4, 30).trim();
        long lastTradedPrice = getLongFromLittleEndian(packetData, 50);
        long lastTradedQuantity = getLongFromLittleEndian(packetData, 58);
        // Extract other fields as needed

        // Calculate implied volatility (IV) using the Black Scholes formula
        double impliedVolatility = calculateImpliedVolatility(lastTradedPrice, lastTradedQuantity);

        // Do further processing or display the calculated IV
        System.out.println("Symbol: " + tradingSymbol);
        System.out.println("Last Traded Price: " + lastTradedPrice);
        System.out.println("Implied Volatility: " + impliedVolatility);
        System.out.println();
    }

    private static long getLongFromLittleEndian(byte[] data, int offset) {
        long value = 0;
        for (int i = 7; i >= 0; i--) {
            value <<= 8;
            value |= (data[offset + i] & 0xFF);
        }
        return value;
    }

    private static double calculateImpliedVolatility(long lastTradedPrice, long lastTradedQuantity) {
        // Implement the Black Scholes formula here
        // Use the received market data to calculate the implied volatility (IV)
        // Return the calculated IV
        return 0.0; // Placeholder value, replace with the actual calculation
    }
}
