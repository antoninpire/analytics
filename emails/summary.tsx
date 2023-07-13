import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import { User, UserPlus } from "lucide-react";

type Stat = {
  total: number;
  change: number;
};

export default function Summary({
  uniqueVisitors = {
    total: 512,
    change: 87,
  },
  newVisitors = {
    total: 54,
    change: 48,
  },
  websiteName = "Acme",
  websiteId = "acme",
  topPages = [
    ["/", 1352],
    ["/pricing", 1141],
    ["/blog", 1023],
    ["/about", 689],
    ["/contact", 412],
  ],
  from = "2023-05-31T22:00:00.000",
  to = "2023-06-29T22:00:00.000Z",
}: {
  uniqueVisitors: Stat;
  newVisitors: Stat;
  websiteName: string;
  websiteId: string;
  topPages: [string, number][];
  from: string;
  to: string;
}) {
  const inactiveWebsite = uniqueVisitors.total === 0;
  return (
    <Html>
      <Head />
      <Preview>Your 30-day Analytics summary for {websiteName}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-10 max-w-[500px] rounded border border-solid border-gray-200 px-10 py-5">
            <Heading className="mx-0 my-7 p-0 text-center text-xl font-semibold text-black">
              Your 30-day Analytics summary for {websiteName}
            </Heading>
            <Text className="text-sm leading-6 text-black">
              In the last 30 days, your website <strong>{websiteName}</strong>{" "}
              had{" "}
              <strong>
                {newVisitors.total} (
                {newVisitors.change >= 0
                  ? `+${newVisitors.change}%`
                  : `-${newVisitors.change}%`}
                )
              </strong>{" "}
              new visitors. The total of unique visitors is{" "}
              <strong>
                {uniqueVisitors.total} (
                {uniqueVisitors.change >= 0
                  ? `+${uniqueVisitors.change}%`
                  : `-${uniqueVisitors.change}%`}
                ){" "}
              </strong>{" "}
              during that time.
            </Text>
            <Section>
              <Row>
                <Column align="center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-200">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <p className="text-sm font-semibold text-black">
                    {uniqueVisitors.total} unique visitors
                  </p>
                </Column>
                <Column align="center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-200">
                    <UserPlus className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="text-sm font-semibold text-black">
                    {newVisitors.total} new visitors
                  </p>
                </Column>
              </Row>
            </Section>
            {topPages.length > 0 && (
              <>
                <Text className="text-sm leading-6 text-black">
                  Here are your top {topPages.length} best performing pages:
                </Text>
                <Section>
                  <Row className="pb-2">
                    <Column align="left" className="text-sm text-gray-500">
                      Page
                    </Column>
                    <Column align="right" className="text-sm text-gray-500">
                      Clicks
                    </Column>
                  </Row>
                  {topPages.map(([page, count], index) => (
                    <div key={index}>
                      <Row>
                        <Column align="left" className="text-sm font-medium">
                          {page.length >= 30
                            ? `${page.slice(0, 30 - 3)}...`
                            : page}
                        </Column>
                        <Column align="right" className="text-sm text-gray-600">
                          {count}
                        </Column>
                      </Row>
                      {index !== topPages.length - 1 && (
                        <Hr className="my-2 w-full border border-gray-200" />
                      )}
                    </div>
                  ))}
                </Section>
              </>
            )}
            {inactiveWebsite ? (
              <>
                <Text className="text-sm leading-6 text-black">
                  It looks like you haven&apos;t had any visitor in the last 30
                  days. If there&apos;s anything that we can do to help, please
                  reply to this email to get in touch with us.
                </Text>

                <Section className="my-8 text-center">
                  <Link
                    className="rounded-full bg-black px-6 py-3 text-center text-[12px] font-semibold text-white no-underline"
                    href={`https://analytics.antonin.dev/dashboard/${websiteId}?f=custom&from=${from}&to=${to}`}
                  >
                    View full analytics
                  </Link>
                </Section>
              </>
            ) : (
              <>
                <Text className="mt-10 text-sm leading-6 text-black">
                  You can view your full stats by clicking the button below.
                </Text>
                <Section className="my-8 text-center">
                  <Link
                    className="rounded-full bg-black px-6 py-3 text-center text-[12px] font-semibold text-white no-underline"
                    href={`https://analytics.antonin.dev/dashboard/${websiteId}?f=custom&from=${from}&to=${to}`}
                  >
                    View full analytics
                  </Link>
                </Section>
              </>
            )}
            <Hr className="mx-0 my-6 w-full border border-gray-200" />
            <Text className="text-[12px] leading-6 text-gray-500">
              This email was intended for members of the{" "}
              <span className="text-black">{websiteName}</span> website on
              Analytics. If you were not expecting this email, you can ignore
              this email. If you are concerned about your account&apos;s safety,
              please reply to this email to get in touch with us.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
