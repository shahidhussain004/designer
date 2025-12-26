 'use client'

import React from 'react'
import { Flex, Text, Divider, Div, LinkComponent } from '@/components/green'

export default function Footer() {
  return (
    <Div background="neutral-02" padding="xl 0">
      <Divider opacity="0.2" />
      <Flex
        flex-direction="s{column} m{row}"
        justify-content="space-between"
        align-items="s{flex-start} m{center}"
        gap="m"
        padding="l"
        max-width="1280px"
        margin="0 auto"
        width="100%"
      >
        <Flex gap="s" align-items="center">
          <Text font="heading-xs">Designer Marketplace</Text>
          <Text font="body-regular-s" color="neutral-02">
            © {new Date().getFullYear()} All rights reserved
          </Text>
        </Flex>

        <Flex gap="l" flex-wrap="wrap">
          <LinkComponent href="/about" text-decoration="none"><Text font="body-regular-s" color="neutral-02">About</Text></LinkComponent>
          <LinkComponent href="/privacy" text-decoration="none"><Text font="body-regular-s" color="neutral-02">Privacy</Text></LinkComponent>
          <LinkComponent href="/terms" text-decoration="none"><Text font="body-regular-s" color="neutral-02">Terms</Text></LinkComponent>
          <LinkComponent href="/contact" text-decoration="none"><Text font="body-regular-s" color="neutral-02">Contact</Text></LinkComponent>
        </Flex>
      </Flex>
    </Div>
  )
}
