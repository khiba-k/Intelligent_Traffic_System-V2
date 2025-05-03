export type SaveSearchInput = {
  userId: string | undefined;
  startingPoint: string;
  destination: string;
};

export async function saveSearch({
  userId,
  startingPoint,
  destination,
}: SaveSearchInput) {
  try {
    if (startingPoint == "" || destination == "") {
      return;
    }

    const response = await fetch("/api/save-searches", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, startingPoint, destination }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error?.error || "Failed to save search");
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error: any) {
    console.error("saveSearch error:", error);
    return { success: false, error: error.message };
  }
}
