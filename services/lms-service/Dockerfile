# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Install certificates and configure NuGet to use SEB Artifactory
RUN apt-get update && apt-get install -y --no-install-recommends curl && \
    curl -s -L http://seb-ca-v2.seb.se/SEB-CA-v2/SEB%20Root%20CA%20v2.pem -o /usr/local/share/ca-certificates/SEB_Root_CA_v2.crt && \
    curl -s -L http://seb-ca-v2.seb.se/SEB-CA-v2/SEB%20Appl%20Sub%20CA%20v2.pem -o /usr/local/share/ca-certificates/SEB_Appl_SubCA_v2.crt && \
    curl -s -L http://pki.seb.se/g3/root/ecc/cert -o /usr/local/share/ca-certificates/SEB_Root_CA_ECC_G3.crt && \
    curl -s -L http://pki.seb.se/g3/root/rsa/cert -o /usr/local/share/ca-certificates/SEB_Root_CA_RSA_G3.crt && \
    update-ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# Configure NuGet to use SEB Artifactory (bypasses external NuGet.org SSL issues)
RUN dotnet nuget add source "https://repo7.sebank.se/artifactory/api/nuget/v3/nuget" --name "SEB Artifactory" && \
    dotnet nuget disable source nuget.org || true

# Copy csproj and restore from Artifactory
COPY *.csproj ./
RUN dotnet restore

# Copy source and build
COPY . .
RUN dotnet publish -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Install fonts for QuestPDF and download SEB Root Certificates
RUN apt-get update && apt-get install -y --no-install-recommends \
    fontconfig \
    fonts-liberation \
    wget && \
    mkdir -p /usr/local/share/ca-certificates && \
    wget --no-check-certificate -O /usr/local/share/ca-certificates/seb_root_ca_ecc_g3.crt \
        "http://pki.seb.se/g3/root/ecc/cert" 2>/dev/null || true && \
    wget --no-check-certificate -O /usr/local/share/ca-certificates/seb_root_ca_rsa_g3.crt \
        "http://pki.seb.se/g3/root/rsa/cert" 2>/dev/null || true && \
    wget --no-check-certificate -O /usr/local/share/ca-certificates/seb_root_ca_v2.crt \
        "http://seb-ca-v2.seb.se/SEB-CA-v2/SEB%20Root%20CA%20v2.pem" 2>/dev/null || true && \
    update-ca-certificates && \
    rm -rf /var/lib/apt/lists/*

COPY --from=build /app/publish .

# Set environment variables
ENV ASPNETCORE_URLS=http://+:8082
ENV ASPNETCORE_ENVIRONMENT=Production

EXPOSE 8082

ENTRYPOINT ["dotnet", "lms-service.dll"]
