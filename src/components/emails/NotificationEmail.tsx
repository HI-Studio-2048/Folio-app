import {
    Body,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Preview,
    Section,
    Text,
    Button,
} from "@react-email/components";
import * as React from "react";

interface NotificationEmailProps {
    title: string;
    message: string;
    actionText?: string;
    actionUrl?: string;
    type?: "alert" | "info" | "success" | "warning";
}

export const NotificationEmail = ({
    title = "New Portfolio Alert",
    message = "You have a new update in your Follio workspace.",
    actionText = "View in Dashboard",
    actionUrl = "https://follio.app/dashboard",
    type = "info",
}: NotificationEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>{title}</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Section style={headerSection}>
                        <Heading style={headerTitle}>Follio</Heading>
                    </Section>

                    <Section style={contentSection}>
                        <Heading style={titleStyle}>{title}</Heading>
                        <Text style={messageStyle}>{message}</Text>

                        {actionText && actionUrl && (
                            <Section style={buttonContainer}>
                                <Button style={button} href={actionUrl}>
                                    {actionText}
                                </Button>
                            </Section>
                        )}
                    </Section>

                    <Hr style={hr} />
                    <Section style={footerSection}>
                        <Text style={footerText}>
                            © 2026 Follio. All rights reserved. <br />
                            You are receiving this because you have alerts enabled in your workspace.
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

export default NotificationEmail;

const main = {
    backgroundColor: "#020617", // slate-950
    fontFamily:
        '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
    margin: "0 auto",
    padding: "40px 0 48px",
    width: "580px",
    maxWidth: "100%",
};

const headerSection = {
    padding: "24px 32px",
    backgroundColor: "#1e293b", // slate-800
    borderTopLeftRadius: "12px",
    borderTopRightRadius: "12px",
    borderBottom: "1px solid #334155", // slate-700
};

const headerTitle = {
    color: "#ffffff",
    fontSize: "24px",
    margin: "0",
    fontWeight: "bold",
    letterSpacing: "1px",
};

const contentSection = {
    padding: "40px 32px",
    backgroundColor: "#0f172a", // slate-900
};

const titleStyle = {
    fontSize: "20px",
    lineHeight: "28px",
    fontWeight: "bold",
    color: "#f8fafc", // slate-50
    margin: "0 0 16px 0",
};

const messageStyle = {
    fontSize: "16px",
    lineHeight: "24px",
    color: "#94a3b8", // slate-400
    margin: "0 0 32px 0",
};

const buttonContainer = {
    textAlign: "center" as const,
    marginBottom: "16px",
};

const button = {
    backgroundColor: "#2563eb", // blue-600
    borderRadius: "8px",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "bold",
    textDecoration: "none",
    textAlign: "center" as const,
    padding: "16px 32px",
    display: "inline-block",
};

const hr = {
    borderColor: "#334155", // slate-700
    margin: "0",
};

const footerSection = {
    padding: "24px 32px",
    backgroundColor: "#0f172a", // slate-900
    borderBottomLeftRadius: "12px",
    borderBottomRightRadius: "12px",
};

const footerText = {
    fontSize: "12px",
    lineHeight: "20px",
    color: "#64748b", // slate-500
    margin: "0",
    textAlign: "center" as const,
};
