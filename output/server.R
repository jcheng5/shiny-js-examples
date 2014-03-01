shinyServer(function(input, output, session) {
  
  output$mychart <- renderLineChart({
    # Return a data frame. Each column will be a series in the line chart.
    #
    # If you're wondering why this structure nonsense instead of the more
    # straightforward data.frame("Sine wave"=..., "Cosine wave"=...), it's
    # because R butchers names with spaces in them when specified that way.
    structure(
      data.frame(
        sin(1:100/10 + input$sinePhase * pi/180) * input$sineAmplitude,
        0.5 * cos(1:100/10),
        sin(1:100/10) * 0.25 + 0.5
      ),
      names = c("Sine wave", "Cosine wave", "Another sine wave")
    )
  })
})
