# Build argument to determine if we're inside SEB network
ARG USE_SEB_ARTIFACTORY=true

# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

ARG USE_SEB_ARTIFACTORY

WORKDIR /src

# Install certificates and curl
RUN apt-get update && apt-get install -y --no-install-recommends curl && \
    rm -rf /var/lib/apt/lists/*

# Configure NuGet sources conditionally
RUN if [ "$USE_SEB_ARTIFACTORY" = "true" ]; then \
        curl -s -L http://seb-ca-v2.seb.se/SEB-CA-v2/SEB%20Root%20CA%20v2.pem -o /usr/local/share/ca-certificates/SEB_Root_CA_v2.crt 2>/dev/null || true && \
        curl -s -L http://seb-ca-v2.seb.se/SEB-CA-v2/SEB%20Appl%20Sub%20CA%20v2.pem -o /usr/local/share/ca-certificates/SEB_Appl_SubCA_v2.crt 2>/dev/null || true && \
        curl -s -L http://pki.seb.se/g3/root/ecc/cert -o /usr/local/share/ca-certificates/SEB_Root_CA_ECC_G3.crt 2>/dev/null || true && \
        curl -s -L http://pki.seb.se/g3/root/rsa/cert -o /usr/local/share/ca-certificates/SEB_Root_CA_RSA_G3.crt 2>/dev/null || true && \
        update-ca-certificates && \
        dotnet nuget add source "https://repo7.sebank.se/artifactory/api/nuget/v3/nuget" --name "SEB Artifactory" && \
        dotnet nuget disable source nuget.org; \
    fi

# Copy csproj and restore
COPY *.csproj ./
RUN dotnet restore

# Copy source and build
COPY . .
RUN dotnet publish -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime

ARG USE_SEB_ARTIFACTORY

WORKDIR /app

# Install fonts for QuestPDF and conditionally download SEB Root Certificates
RUN apt-get update && apt-get install -y --no-install-recommends \
    fontconfig \
    fonts-liberation \
    wget && \
    rm -rf /var/lib/apt/lists/*

RUN if [ "$USE_SEB_ARTIFACTORY" = "true" ]; then \
        mkdir -p /usr/local/share/ca-certificates && \
        wget --no-check-certificate -O /usr/local/share/ca-certificates/seb_root_ca_ecc_g3.crt \
            "http://pki.seb.se/g3/root/ecc/cert" 2>/dev/null || true && \
        wget --no-check-certificate -O /usr/local/share/ca-certificates/seb_root_ca_rsa_g3.crt \
            "http://pki.seb.se/g3/root/rsa/cert" 2>/dev/null || true && \
        wget --no-check-certificate -O /usr/local/share/ca-certificates/seb_root_ca_v2.crt \
            "http://seb-ca-v2.seb.se/SEB-CA-v2/SEB%20Root%20CA%20v2.pem" 2>/dev/null || true && \
        update-ca-certificates; \
    fi

COPY --from=build /app/publish .

# Set environment variables
ENV ASPNETCORE_URLS=http://+:8082
ENV ASPNETCORE_ENVIRONMENT=Production

EXPOSE 8082

ENTRYPOINT ["dotnet", "lms-service.dll"]