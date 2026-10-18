# AC-17 — Remote Access

**Source:** [ITSG-33 Annex 3A, AC-17](https://www.cyber.gc.ca/en/guidance/annex-3a-security-control-catalogue-itsg-33).

## Control definition

Establish and document restrictions, configuration requirements, and connection guidance for each permitted type of remote access; authorize remote access before allowing it; and require off-site personnel to protect organisational information under applicable physical-security requirements.

**Organisation-defined parameters to review:** permitted remote-access types; authorized users; connection and configuration requirements; monitoring scope; approved access points; and required disconnection or disablement time.

## Supplemental guidance

Remote access reaches a system through an external network. Encryption such as a VPN can protect traffic confidentiality and integrity, but does not make the endpoint or remote connection trustworthy and can affect monitoring visibility. Safeguard the endpoint and access path as well as the network tunnel.

## In plain language

Remote access is a key to the office from outside the building. A secure tunnel is like an enclosed walkway, but it does not prove that the person or computer at the far end is safe.

## Stagehand initial assessment

Stagehand may be used locally or through a remote desktop, hosted browser, CI runner, or other remote arrangement. Its architecture and deployment controls are not assumed here to implement enterprise remote-access authorization. Operators should require organisation-approved remote access, MFA where available, managed and patched endpoints, least privilege, encrypted connections, and logging at the access gateway. Avoid exposing browser-control or automation ports directly to untrusted networks. Select VPN/proxy monitoring settings with security teams so encryption does not create an unmonitored path.

## Control enhancements

Enhancements address automated monitoring/control of remote access, encryption, managed access-control points, privileged remote access, protecting remote-access information, privileged-function limitations, timely disconnection, and dedicated access consoles. The catalogue also records withdrawn enhancements incorporated elsewhere. Apply the current catalogue’s enhancement status and deployment baseline; no such feature is asserted as built into Stagehand.
