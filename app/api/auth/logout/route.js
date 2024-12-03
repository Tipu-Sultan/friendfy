export async function POST(req) {
    try {        
        // Clear the cookie by setting it to expire in the past
        const response = new Response(
            JSON.stringify({ message: "Logout successful" }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }
        );

        response.headers.append(
            "Set-Cookie",
            "authToken=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0"
        );

        return response;
    } catch (error) {
        console.error("Logout error:", error);
        return new Response(
            JSON.stringify({ error: "Internal server error" }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}
