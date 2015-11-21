<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<!--
	XML to JXON
	
	created file by mu-tan8(theta) 2015/11/21
-->

	<xsl:output method="text" media-type="application/json" encoding="UTF-8" />

	<xsl:template name="escape">
		<xsl:param name="arg" />
		<xsl:variable name="YEN"><xsl:call-template name="replace"><xsl:with-param name="arg" select="$arg" /><xsl:with-param name="before">\</xsl:with-param><xsl:with-param name="after" >\\</xsl:with-param></xsl:call-template></xsl:variable>
		<xsl:variable name="QUOT"><xsl:call-template name="replace"><xsl:with-param name="arg" select="$YEN" /><xsl:with-param name="before">&quot;</xsl:with-param><xsl:with-param name="after" >\&quot;</xsl:with-param></xsl:call-template></xsl:variable>
		<xsl:variable name="LF"><xsl:call-template name="replace"><xsl:with-param name="arg" select="$QUOT" /><xsl:with-param name="before">&#010;</xsl:with-param><xsl:with-param name="after" >\n</xsl:with-param></xsl:call-template></xsl:variable>
		<xsl:call-template name="replace"><xsl:with-param name="arg" select="$LF" /><xsl:with-param name="before">&#009;</xsl:with-param><xsl:with-param name="after" >\t</xsl:with-param></xsl:call-template>
	</xsl:template>

	<xsl:template name="replace">
		<xsl:param name="arg" />
		<xsl:param name="before" />
		<xsl:param name="after" />
		<xsl:choose>
			<xsl:when test="contains($arg,$before)"><xsl:value-of select="substring-before($arg,$before)" /><xsl:value-of select="$after" /><xsl:call-template name="replace"><xsl:with-param name="arg" select="substring-after($arg,$before)" /><xsl:with-param name="before" select="$before" /><xsl:with-param name="after" select="$after" /></xsl:call-template></xsl:when>
			<xsl:otherwise><xsl:value-of select="$arg" /></xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<xsl:template name="namespaces">
		<xsl:variable name="ns" select="count(namespace::node())" />
		<xsl:for-each select="namespace::node()">
			<xsl:if test="name(.)!='xml'">&#009;&quot;@xmlns:<xsl:value-of select="name(.)" />&quot; : &quot;<xsl:value-of select="." />&quot;<xsl:if test="$ns&gt;=position()"> ,&#010;&#009;</xsl:if></xsl:if>
		</xsl:for-each>
	</xsl:template>

	<xsl:template name="nest">
		<xsl:if test="current()=/"><xsl:call-template name="namespaces" /></xsl:if><xsl:apply-templates select="@*" />&#009;<xsl:apply-templates />
	</xsl:template>

	<xsl:template match="/">{&#010;<xsl:apply-templates select="node()" />&#010;}&#010;</xsl:template>

	<xsl:template match="*">&#009;&quot;<xsl:value-of select="name(.)" />&quot; : <xsl:choose><xsl:when test="count(*)&gt;1">[{&#010;&#009;<xsl:call-template name="nest" />&#010;&#009;}]</xsl:when><xsl:when test="count(node())=1 or count(@*)&gt;0">{&#010;&#009;<xsl:call-template name="nest" />&#010;&#009;}</xsl:when><xsl:otherwise>null</xsl:otherwise></xsl:choose><xsl:if test="position()!=last()"> ,&#010;&#009;</xsl:if></xsl:template>

	<xsl:template match="processing-instruction()">&#009;&quot;?<xsl:value-of select="name(.)" />&quot; : &quot;<xsl:call-template name="escape"><xsl:with-param name="arg" select="." /></xsl:call-template>&quot; ,&#010;</xsl:template>

	<xsl:template match="comment()">&#009;/*<xsl:value-of select="." />*/&#010;</xsl:template>

	<xsl:template match="@*">&#009;&quot;@<xsl:value-of select="name(.)" />&quot; : <xsl:choose><xsl:when test="string(number(.))='NaN'">&quot;<xsl:call-template name="replace"><xsl:with-param name="arg" select="." /><xsl:with-param name="before">\</xsl:with-param><xsl:with-param name="after" >\\</xsl:with-param></xsl:call-template>&quot;</xsl:when><xsl:otherwise><xsl:value-of select="." /></xsl:otherwise></xsl:choose><xsl:if test="count(../@*)&gt;=position()"> ,&#010;&#009;</xsl:if></xsl:template>

	<xsl:template match="text()">&#009;&quot;keyValue&quot; : <xsl:choose><xsl:when test="string(number(.))='NaN'">&quot;<xsl:call-template name="escape"><xsl:with-param name="arg" select="." /></xsl:call-template>&quot;</xsl:when><xsl:otherwise><xsl:value-of select="." /></xsl:otherwise></xsl:choose>&#010;&#009;</xsl:template>

</xsl:stylesheet>