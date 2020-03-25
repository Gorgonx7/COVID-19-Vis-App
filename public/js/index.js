var svg = d3.select('svg'); 
svg.selectAll('path').on('mouseenter', handleMouseOver).on('mouseleave', handleMouseOut);

// Create Event Handlers for mouse
function handleMouseOver(d, i) {  // Add interactivity
    console.log(i);
    
    // Use D3 to select element, change color and size
    d3.select(this).attr('stroke', 'black').attr('stroke-width', '5');
}/*  
    // Specify where to put label of text
    svg.append('text').attr({
       id: 't' + d.class,  // Create an id for text so we can select it later for removing on mouseout 
    })
    .text(function() {
      return 'Insert value here';  // Value of the text
    });
  }*/
  
  function handleMouseOut(d, i) {
    // Use D3 to select element, change color back to normal
    d3.select(this).attr('stroke', '').attr('stroke-width', '1');
  
    // Select text by id and then remove
    //d3.select('#t' +  d.class).remove();  // Remove text location
  }
