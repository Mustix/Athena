// app/api/getToken/route.ts
import { NextRequest, NextResponse } from "next/server";

const fetchToken = async () => {
  const response = await fetch(
    "https://api.platform.athenahealth.com/oauth2/v1/token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic MG9hYzdyNDVqZkJ5NzNaSlAyOTc6Rk9uclU3V2k5ZHFtWldrendLcWU0QjYxMmNITVA4WXRfYVAxYWFhVw==",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        scope: "athena/service/Athenanet.MDP.*",
      }),
    }
  );

  if (!response.ok)
    throw new Error(`Token fetch failed: ${response.statusText}`);
  return response.json();
};

const getPatientData = async (token: object, athenaId: string) => {
  const practiceId = "25246";
  console.log("Token:", token);
  console.log("Type of token:", typeof token);
  const response = await fetch(
    `https://api.platform.athenahealth.com/v1/${practiceId}/patients/${athenaId}`,
    {
      headers: {
        Accept: "application/json",
        // @ts-expect-error ignore because i said so
        Authorization: `Bearer ${token.access_token}`,
      },
    }
  );

  if (!response.ok)
    throw new Error(`Patient data fetch failed: ${response.statusText}`);
  return response.json();
};

export async function GET(request: NextRequest) {
  try {
    const athenaId = request.nextUrl.searchParams.get("athenaId");
    if (!athenaId) throw new Error("Athena ID is required");

    const token = await fetchToken();
    const patientData = await getPatientData(token, athenaId);

    return NextResponse.json(patientData);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An error occurred" },
      { status: 500 }
    );
  }
}
