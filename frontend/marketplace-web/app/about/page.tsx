import { Card, Divider, Flex, Text } from '@/components/green'
import { PageLayout } from '@/components/layout'

export default function AboutPage() {
  return (
    <PageLayout>
      <Flex flex-direction="column" gap="l" padding="l" style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div>
          <Text font-size="heading-l">About Designer Marketplace</Text>
          <Text font-size="body-l" color="neutral-02">
            Designer Marketplace connects businesses with top design and product talent. We make it
            simple to find, hire, and collaborate with experienced freelancers and teams who ship
            delightful user experiences.
          </Text>
        </div>

        <Card padding="l">
          <Flex flex-direction="column" gap="m">
            <Text font-size="heading-s">Our Mission</Text>
            <Text font-size="body-l">
              We believe great design changes outcomes. Our mission is to empower organizations of
              every size to access curated, reliable design professionals — quickly and safely.
            </Text>

            <Divider />

            <Text font-size="heading-s">How It Works</Text>
            <Text font-size="body-l">
              Post a brief or browse curated talent. Review portfolios, invite candidates to
              interview, and start your project with confidence. Our platform supports proposals,
              secure payments, and milestone tracking so teams can focus on work, not logistics.
            </Text>

            <Divider />

            <Text font-size="heading-s">Our Values</Text>
            <Text font-size="body-l">
              We prioritize trust, transparency, and quality. Every freelancer is vetted and
              portfolios are reviewed to ensure a high bar for craftsmanship and communication.
            </Text>

            <Divider />

            <Text font-size="heading-s">The Team</Text>
            <Text font-size="body-l">
              Designer Marketplace was founded by product and design practitioners. Our small,
              distributed team focuses on building tools and workflows that remove friction from
              hiring and enable sustained collaboration between clients and creatives.
            </Text>

            <Divider />

            <Text font-size="heading-s">Hiring & Partnerships</Text>
            <Text font-size="body-l">
              We partner with agencies, consultancies, and enterprises to provide customized
              talent solutions. If you're interested in a strategic partnership or embedded team,
              contact us at partnerships@designer-marketplace.com.
            </Text>

            <Divider />

            <Text font-size="heading-s">Contact</Text>
            <Text font-size="body-l">
              For press, partnerships, or general inquiries, please reach out at support@designer-marketplace.com.
            </Text>
          </Flex>
        </Card>
      </Flex>
    </PageLayout>
  )
}
