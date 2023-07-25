package main

import (
	"context"
	"encoding/base64"
	"net/http"

	"oss.terrastruct.com/d2/d2graph"
	"oss.terrastruct.com/d2/d2layouts/d2elklayout"
	"oss.terrastruct.com/d2/d2lib"
	"oss.terrastruct.com/d2/d2renderers/d2svg"
	"oss.terrastruct.com/d2/d2themes/d2themescatalog"
	"oss.terrastruct.com/d2/lib/textmeasure"
)

func handleRender(w http.ResponseWriter, r *http.Request) {
	src := r.URL.Query().Get("src")
	// un-base64
	srcBytes, err := base64.StdEncoding.DecodeString(src)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	// render
	if err := renderSvg(w, string(srcBytes)); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func renderSvg(w http.ResponseWriter, contents string) error {
	ruler, _ := textmeasure.NewRuler()
	defaultLayout := func(ctx context.Context, g *d2graph.Graph) error {
		return d2elklayout.Layout(ctx, g, nil)
	}
	diagram, _, _ := d2lib.Compile(context.Background(), contents, &d2lib.CompileOptions{
		Layout: defaultLayout,
		Ruler:  ruler,
	})
	out, _ := d2svg.Render(diagram, &d2svg.RenderOpts{
		Pad:     d2svg.DEFAULT_PADDING,
		Sketch:  true,
		ThemeID: d2themescatalog.EvergladeGreen.ID,
	})
	w.Header().Set("Content-Type", "image/svg+xml")
	w.Write(out)
	return nil
}

// func renderSvg(contents string, outFilePath string) error {
// 	ruler, _ := textmeasure.NewRuler()
// 	defaultLayout := func(ctx context.Context, g *d2graph.Graph) error {
// 		return d2elklayout.Layout(ctx, g, nil)
// 	}
// 	diagram, _, _ := d2lib.Compile(context.Background(), contents, &d2lib.CompileOptions{
// 		Layout: defaultLayout,
// 		Ruler:  ruler,
// 	})
// 	out, _ := d2svg.Render(diagram, &d2svg.RenderOpts{
// 		Pad:     d2svg.DEFAULT_PADDING,
// 		ThemeID: d2themescatalog.GrapeSoda.ID,
// 	})
// 	return ioutil.WriteFile(outFilePath, out, 0600)
// }
