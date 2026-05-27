import axiosClient from "../api/axios";

export default function Home() {
    const callApi = async () => {
        const res = await axiosClient.get("/hello");
        alert(res.data);
    };

    return (
        <div>
            <h1>Home</h1>
            <button onClick={callApi}>Call API</button>
        </div>
    );
}