import { Member } from "@/entity/member.entity";
import { dataSource } from "@/share/lib/typeorm/app-data-source";
import { NextPage } from "next";

interface Props {
  searchParams: { code: string };
}

const Page: NextPage<Props> = async ({ searchParams: { code } }) => {
  const body = {
    grant_type: "authorization_code",
    client_id: process.env.NEXT_PUBLIC_CLIENT_ID!,
    redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URL!,
    code,
  };

  if (Object.keys(body).some((v) => !v)) throw new Error("값이 잘못되었음");

  const response = await fetch("https://kauth.kakao.com/oauth/token", {
    method: "POST",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
    },
    body: new URLSearchParams(body).toString(),
  });

  let data = await response.json();
  const accessToken = await data?.access_token;

  if (!accessToken) throw new Error("accessToken 이 존재 하지 않음");

  const response2 = await fetch(
    `https://kapi.kakao.com/v2/user/me?${new URLSearchParams({
      secure_resource: "true",
    }).toString()}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    }
  );

  data = await response2.json();
  const id = Number(data?.id) as number;
  const nickname = data?.kakao_account?.profile?.nickname;
  const profileUrl = data?.kakao_account?.profile?.profile_image_url;

  const memberRepository = (await dataSource()).getRepository(Member);

  let findMember = await memberRepository.findOne({ where: { id } });

  if (!findMember) {
    findMember = memberRepository.create({ id, nickname, profileUrl });
    await memberRepository.save(findMember);
  }

  // TODO: jwt 발급하고 / 으로 redirect
  return <></>;
};

export default Page;
