 'use client'

import React from 'react'
import { GdsFlex, GdsText, GdsDivider, GdsDiv, GdsLink } from '@sebgroup/green-core/react'

export default function Footer() {
  return (
    <GdsDiv background="neutral-02" padding="xl 0">
      <GdsDivider opacity="0.2" />
      <GdsFlex
        flex-direction="s{column} m{row}"
        justify-content="space-between"
        align-items="s{flex-start} m{center}"
        gap="m"
        padding="l"
        max-width="1280px"
        margin="0 auto"
        width="100%"
      >
        <GdsFlex gap="s" align-items="center">
          <GdsText font="heading-xs">Designer Marketplace</GdsText>
          <GdsText font="body-regular-s" color="neutral-02">
            © {new Date().getFullYear()} All rights reserved
          </GdsText>
        </GdsFlex>

        <GdsFlex gap="l" flex-wrap="wrap">
          <GdsLink href="/about" text-decoration="none"><GdsText font="body-regular-s" color="neutral-02">About</GdsText></GdsLink>
          <GdsLink href="/privacy" text-decoration="none"><GdsText font="body-regular-s" color="neutral-02">Privacy</GdsText></GdsLink>
          <GdsLink href="/terms" text-decoration="none"><GdsText font="body-regular-s" color="neutral-02">Terms</GdsText></GdsLink>
          <GdsLink href="/contact" text-decoration="none"><GdsText font="body-regular-s" color="neutral-02">Contact</GdsText></GdsLink>
        </GdsFlex>
      </GdsFlex>
    </GdsDiv>
  )
}
