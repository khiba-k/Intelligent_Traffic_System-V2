import TrafficWrapper from "@/screens/traffic/TrafficWrapper";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";


export default async function Page() {
    const authData = await auth();
    const { userId } = authData;

    if (!userId) {
        redirect("/login");
    }

    return <TrafficWrapper />;
}

